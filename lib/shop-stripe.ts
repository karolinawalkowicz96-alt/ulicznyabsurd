import { paymentSettings, stripeKeyMode } from './stripe-config';
import { defaultSettings } from './shop-seed';
import { randomUUID } from 'node:crypto';
import { transaction } from './shop-db';
import { hash } from './shop-auth';
import type { ShopOrder } from './shop-types';

async function stripeRequest(path:string, body:URLSearchParams, key:string) {
  const response=await fetch(`https://api.stripe.com/v1/${path}`,{method:'POST',headers:{Authorization:`Bearer ${process.env.STRIPE_SECRET_KEY}`,'Content-Type':'application/x-www-form-urlencoded','Idempotency-Key':key,'Stripe-Version':'2026-08-26.dahlia'},body,signal:AbortSignal.timeout(15000)});
  const data=await response.json() as {id?:string;url?:string};
  if(!response.ok)throw new Error('Operator płatności jest chwilowo niedostępny. Ponów próbę dla tego samego zamówienia.');
  return data;
}
export async function startStripePayment(id:string, token:string) {
  if(!stripeKeyMode()||!process.env.STRIPE_WEBHOOK_SECRET)throw new Error('Stripe nie jest skonfigurowany.');
  return transaction(async c=>{
    const row=(await c.query('SELECT data,token_hash FROM shop_orders WHERE id=$1 FOR UPDATE',[id])).rows[0];
    if(!row||row.token_hash!==hash(token))throw new Error('Nie znaleziono zamówienia.');
    const order=row.data as ShopOrder;
    if(order.payment!=='stripe'||order.paymentStatus!=='unpaid'||order.stockRestored||order.status==='cancelled')throw new Error('Nie można opłacić tego zamówienia.');
    if(order.testMode!==(stripeKeyMode()==='test'))throw new Error('Tryb Stripe nie odpowiada zamówieniu.');
    const settings=(await c.query('SELECT data FROM shop_settings WHERE id=1')).rows[0]?.data;
    if(!paymentSettings({...defaultSettings,...settings}).stripeActive)throw new Error('Stripe jest wyłączony.');
    if(order.stripeUrl)return {url:order.stripeUrl};
    const base=(process.env.APP_URL||'http://localhost:3000').replace(/\/$/,'');
    const receipt=`${base}/zamowienie?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`;
    if(Date.now()-new Date(order.createdAt).getTime()>23*3600*1000)throw new Error('Termin płatności minął. Skontaktuj się ze sklepem.');
    const body=new URLSearchParams({mode:'payment',integration_identifier:'uliczny-absurd-checkout-qntwzplk',success_url:receipt+'&payment=return',cancel_url:receipt+'&payment=cancelled',client_reference_id:id,'metadata[order_id]':id,'customer_email':order.customer.email,locale:'pl','shipping_options[0][shipping_rate_data][type]':'fixed_amount','shipping_options[0][shipping_rate_data][fixed_amount][amount]':String(order.shipping),'shipping_options[0][shipping_rate_data][fixed_amount][currency]':'pln','shipping_options[0][shipping_rate_data][display_name]':'Dostawa',expires_at:String(Math.floor(new Date(order.createdAt).getTime()/1000)+86400)});
    order.items.forEach((item,i)=>{body.set(`line_items[${i}][price_data][currency]`,'pln');body.set(`line_items[${i}][price_data][unit_amount]`,String(item.price));body.set(`line_items[${i}][price_data][product_data][name]`,`${item.name} / ${item.size}`);body.set(`line_items[${i}][quantity]`,String(item.quantity));});
    const session=await stripeRequest('checkout/sessions',body,`ua-session-${id}`);
    if(typeof session.id!=='string'||typeof session.url!=='string'||!session.url.startsWith('https://checkout.stripe.com/'))throw new Error('Nieprawidłowa odpowiedź operatora.');
    order.stripeSessionId=session.id;order.stripeUrl=session.url;
    await c.query('UPDATE shop_orders SET data=$2 WHERE id=$1',[id,JSON.stringify(order)]);
    return {url:session.url};
  });
}
export async function applyStripeEvent(event:{id:string;type:string;livemode:boolean;data:{object:{id:string;currency:string;amount_total:number;payment_status:string;metadata?:{order_id?:string}}}}) {
  const s=event.data?.object;
  const paid=['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type)&&s?.payment_status==='paid';
  const failed=['checkout.session.expired','checkout.session.async_payment_failed'].includes(event.type);
  if(!paid&&!failed)return 'ignored';
  if(!s?.metadata?.order_id||s.currency!=='pln'||!Number.isSafeInteger(s.amount_total))throw new Error('Webhook nie odpowiada zamówieniu.');
  return transaction(async c=>{
    const row=(await c.query('SELECT data FROM shop_orders WHERE id=$1 FOR UPDATE',[s.metadata!.order_id])).rows[0];
    if(!row)throw new Error('Nie znaleziono zamówienia.');
    const order=row.data as ShopOrder;
    if(order.payment!=='stripe'||order.total!==s.amount_total||order.stripeSessionId!==s.id||order.testMode===event.livemode)throw new Error('Dane płatności nie odpowiadają zamówieniu.');
    if(order.paymentStatus==='paid')return 'duplicate';
    if(order.paymentStatus!=='unpaid')return 'duplicate';
    if(paid){if(order.stockRestored)throw new Error('Płatność wymaga ręcznego uzgodnienia magazynu.');order.paymentStatus='paid';order.history.push({at:new Date().toISOString(),action:'Stripe potwierdził płatność.'});}
    else {order.paymentStatus=event.type==='checkout.session.expired'?'expired':'failed';order.status='cancelled';if(!order.stockRestored){for(const i of [...order.items].sort((a,b)=>(a.id+a.size).localeCompare(b.id+b.size)))await c.query(`UPDATE shop_variants SET ${order.testMode?'test_stock':'stock'}=COALESCE(${order.testMode?'test_stock':'stock'},0)+$3 WHERE product_id=$1 AND size=$2`,[i.id,i.size,i.quantity]);order.stockRestored=true;}order.history.push({at:new Date().toISOString(),action:'Stripe: płatność wygasła lub nie powiodła się. Zwolniono towar.'});}
    await c.query('UPDATE shop_orders SET data=$2 WHERE id=$1',[order.id,JSON.stringify(order)]);
    if(!order.testMode)for(const recipient of new Set([order.customer.email,'ulicznyabsurd@gmail.com']))await c.query('INSERT INTO shop_outbox(id,order_id,recipient,event) VALUES($1,$2,$3,$4)',[randomUUID(),order.id,recipient,paid?'paid':'cancelled']);
    return 'ok';
  });
}
