import {transition,verifySignature} from '@/lib/checkout';import {json,hasRedis} from '@/lib/server';
export async function POST(r:Request){
 if(!process.env.STRIPE_WEBHOOK_SECRET||!hasRedis())return json({error:'Webhook is not configured'},503);
 const raw=await r.text();if(raw.length>200000)return json({error:'Payload too large'},413);
 if(!await verifySignature(raw,r.headers.get('stripe-signature')||'',process.env.STRIPE_WEBHOOK_SECRET))return json({error:'Invalid signature'},400);
 let event;try{event=JSON.parse(raw);}catch{return json({error:'Invalid event'},400);}
 const s=event.data?.object;if(!s)return json({error:'Invalid event'},400);
 let state:'paid'|'failed'|'expired'|null=null;
 if(['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type)&&s.payment_status==='paid')state='paid';
 if(event.type==='checkout.session.async_payment_failed')state='failed';if(event.type==='checkout.session.expired')state='expired';
 if(!state)return json({received:true});
 if(s.currency!=='pln'||typeof s.metadata?.order_id!=='string'||!/^[a-f\d-]{36}$/i.test(s.metadata.order_id)||!Number.isSafeInteger(s.amount_total))return json({error:'Order mismatch'},400);
 try{const result=await transition(s.metadata.order_id,state,s.id,s.amount_total);if(!['ok','duplicate'].includes(result))return json({error:'Order reconciliation needed'},409);return json({received:true});}catch{return json({error:'Persistence unavailable; retry'},503);}
}
