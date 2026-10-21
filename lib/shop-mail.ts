import { db, transaction } from './shop-db';
import { orderEmail } from './shop-email-template';
import type { ShopOrder } from './shop-types';

export async function retryNotifications() {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return {sent:0,status:'not_configured'};
  let sent = 0, failed = 0;
  const started = Date.now();
  // Leave time for the last provider request and database update within the function budget.
  for (let i = 0; i < 20 && Date.now() - started < 40000; i++) {
    const job = await transaction(async c => {
      const r = (await c.query("SELECT * FROM shop_outbox WHERE status IN ('pending','failed','sending') AND available_at<=now() AND attempts<10 ORDER BY available_at FOR UPDATE SKIP LOCKED LIMIT 1")).rows[0];
      if (!r) return null;
      const order = (await c.query('SELECT data FROM shop_orders WHERE id=$1',[r.order_id])).rows[0]?.data as ShopOrder | undefined;
      if (!order || order.testMode) {
        await c.query("UPDATE shop_outbox SET status='failed',attempts=10,error='Brak rzeczywistego zamówienia' WHERE id=$1",[r.id]);
        return {blocked:true};
      }
      // Persist the exact payload: Resend rejects a changed body under the same idempotency key.
      r.payload ||= JSON.stringify(orderEmail(order, r.event, r.recipient, process.env.EMAIL_FROM!));
      await c.query("UPDATE shop_outbox SET status='sending',payload=$2,attempts=attempts+1,available_at=now()+interval '10 minutes' WHERE id=$1",[r.id,r.payload]);
      return r;
    });
    if (!job) break;
    if (job.blocked) { failed++; continue; }
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method:'POST', headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':job.id},
        body:job.payload, signal:AbortSignal.timeout(15000)
      });
      const result = await response.json().catch(() => null) as {id?:string} | null;
      if (!response.ok || !result?.id) throw new Error(`Dostawca poczty: HTTP ${response.status}; brak potwierdzenia wysyłki`);
      await db().query("UPDATE shop_outbox SET status='sent',sent_at=now(),provider_id=$2,error=NULL WHERE id=$1",[job.id,result.id]);
      await db().query("UPDATE shop_orders SET data=jsonb_set(data,'{notificationStatus}',to_jsonb('sent'::text)) WHERE id=$1 AND NOT EXISTS(SELECT 1 FROM shop_outbox WHERE order_id=$1 AND status<>'sent')",[job.order_id]);
      sent++;
    } catch (e) {
      await db().query("UPDATE shop_outbox SET status='failed',error=$2,available_at=now()+interval '15 minutes' WHERE id=$1",[job.id,e instanceof Error ? e.message : 'Błąd poczty']);
      failed++;
    }
  }
  return {sent,failed,status:'processed'};
}
