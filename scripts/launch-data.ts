import { db, transaction } from '../lib/shop-db';
import { seedProducts } from '../lib/shop-seed';
// Apply only to the authorized production deployment; previews never modify production data.
if (process.env.VERCEL_ENV === 'production' && process.env.DATABASE_URL) {
  await transaction(async c => {
    await c.query('CREATE TABLE IF NOT EXISTS shop_data_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
    await c.query("SELECT pg_advisory_xact_lock(hashtext('launch-data-2026-10-21'))");
    if ((await c.query('SELECT id FROM shop_data_migrations WHERE id=$1',['launch-data-2026-10-21'])).rows.length) return;
    const result=await c.query("UPDATE shop_settings SET data=data || $1::jsonb WHERE id=1",[JSON.stringify({sellerPhone:'+48 513 258 296',sizeChartApproved:true})]);
    if (!result.rowCount) throw new Error('Shop settings missing: launch data not applied');
    for (const p of seedProducts) {
      await c.query('UPDATE shop_products SET data=data || $2::jsonb WHERE id=$1',[p.id,JSON.stringify({material:p.material,composition:p.composition,care:p.care})]);
    }
    await c.query('INSERT INTO shop_data_migrations(id) VALUES($1)',['launch-data-2026-10-21']);
    console.log('Seller phone and supplier product data updated.');
  });
  await db().end();
}
