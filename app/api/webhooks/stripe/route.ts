import { after } from 'next/server';
import { retryNotifications } from '@/lib/shop-mail';
import { verifySignature } from '@/lib/checkout';
import { applyStripeEvent } from '@/lib/shop-stripe';
export async function POST(r:Request){if(!process.env.STRIPE_WEBHOOK_SECRET||!process.env.DATABASE_URL)return Response.json({error:'Webhook is not configured'},{status:503});const raw=await r.text();if(raw.length>200000)return new Response(null,{status:413});if(!await verifySignature(raw,r.headers.get('stripe-signature')||'',process.env.STRIPE_WEBHOOK_SECRET))return Response.json({error:'Invalid signature'},{status:400});try{await applyStripeEvent(JSON.parse(raw));after(async()=>{try{await retryNotifications();}catch{console.error('Mail worker failed; outbox retained.');}});return Response.json({received:true});}catch{return Response.json({error:'Order reconciliation needed; retry'},{status:500});}}
