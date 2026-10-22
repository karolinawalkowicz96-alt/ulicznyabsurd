import { transaction } from './shop-db';

// Owner authorized removal of every pre-launch order on 2026-10-22.
// A permanent migration marker prevents deletion/reset on subsequent deployments.
export async function prepareProductionLaunch() {
  return transaction(async c => {
    const id='production-launch-cleanup-2026-10-22';
    await c.query('CREATE TABLE IF NOT EXISTS shop_data_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
    await c.query('ALTER TABLE shop_data_migrations ADD COLUMN IF NOT EXISTS audit jsonb');
    await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',[id]);
    const previous=(await c.query('SELECT audit FROM shop_data_migrations WHERE id=$1',[id])).rows[0];
    if(previous)return {alreadyApplied:true,...previous.audit};
    // Same lock order as checkout; block writers throughout the atomic cleanup.
    await c.query('LOCK TABLE shop_settings,shop_orders,shop_variants,shop_outbox,shop_ledger IN ACCESS EXCLUSIVE MODE');
    const outbox=await c.query('DELETE FROM shop_outbox');
    const ledger=await c.query('DELETE FROM shop_ledger');
    const orders=await c.query('DELETE FROM shop_orders');
    const variants=await c.query('UPDATE shop_variants SET stock=10');
    const products=Number((await c.query('SELECT count(DISTINCT product_id) AS count FROM shop_variants')).rows[0].count);
    await c.query('UPDATE shop_settings SET data=data || $1::jsonb WHERE id=1',[JSON.stringify({testMode:false,salesActive:true,codActive:false,stripeActive:true})]);
    const remaining=Number((await c.query('SELECT count(*) AS count FROM shop_orders')).rows[0].count);
    const incorrect=Number((await c.query('SELECT count(*) AS count FROM shop_variants WHERE stock IS DISTINCT FROM 10')).rows[0].count);
    if(remaining||incorrect||!variants.rowCount)throw new Error('Production launch inventory/order verification failed');
    const audit={deletedOrders:orders.rowCount,deletedNotifications:outbox.rowCount,deletedLedger:ledger.rowCount,products,variants:variants.rowCount,remainingOrders:remaining,incorrectStock:incorrect};
    await c.query('INSERT INTO shop_data_migrations(id,audit) VALUES($1,$2)',[id,JSON.stringify(audit)]);
    return {alreadyApplied:false,...audit};
  });
}
