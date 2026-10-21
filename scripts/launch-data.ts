import { db, transaction } from '../lib/shop-db';
import { getSettings } from '../lib/shop-service';
import { saveSettings } from '../lib/shop-admin';
import { seedProducts } from '../lib/shop-seed';
// Apply only to the authorized production deployment; previews never modify production data.
if (process.env.VERCEL_ENV === 'production' && process.env.DATABASE_URL) {
  await db().query('ALTER TABLE shop_outbox ADD COLUMN IF NOT EXISTS payload text');
  await db().query('ALTER TABLE shop_outbox ADD COLUMN IF NOT EXISTS provider_id text');
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
  await transaction(async c => {
    const id='storefront-ready-2026-10-21';
    await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',[id]);
    if((await c.query('SELECT id FROM shop_data_migrations WHERE id=$1',[id])).rows.length)return;
    await c.query('UPDATE shop_settings SET data=data || $1::jsonb WHERE id=1',[JSON.stringify({testMode:false,salesActive:false,codActive:false,stripeActive:false,fulfillmentDays:7,courierActive:true,lockerActive:true,courierPrice:1899,lockerPrice:1499})]);
    const order=['oko-01','glowka-04','paliwko-07','zawodowcy-05','noc-02','ceny-08','szef-03','dom-06'];
    for(const [sortOrder,id] of order.entries())await c.query('UPDATE shop_products SET data=data || $2::jsonb WHERE id=$1',[id,JSON.stringify({price:7999,priceApproved:true,sortOrder})]);
    await c.query('INSERT INTO shop_data_migrations(id) VALUES($1)',[id]);
    console.log('Storefront pricing, ordering and delivery updated; payment activation remains pending.');
  });
  await transaction(async c => {
    const id='cod-test-checkout-2026-10-21';
    await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',[id]);
    if((await c.query('SELECT id FROM shop_data_migrations WHERE id=$1',[id])).rows.length)return;
    await c.query('UPDATE shop_settings SET data=data || $1::jsonb WHERE id=1',[JSON.stringify({testMode:true,salesActive:false,codActive:true,stripeActive:false})]);
    await c.query('INSERT INTO shop_data_migrations(id) VALUES($1)',[id]);
    console.log('Test COD checkout enabled; live sales remain disabled.');
  });
  await transaction(async c => {
    const id='end-public-test-orders-2026-10-21';
    await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',[id]);
    if((await c.query('SELECT id FROM shop_data_migrations WHERE id=$1',[id])).rows.length)return;
    // Retain fulfillment and product-readiness checks until actual supplier/carrier data is supplied.
    await c.query("UPDATE shop_settings SET data=data || $1::jsonb WHERE id=1",[JSON.stringify({testMode:false})]);
    await c.query('INSERT INTO shop_data_migrations(id) VALUES($1)',[id]);
    console.log('Public test checkout disabled; existing sale-readiness safeguards retained.');
  });
  await transaction(async c => {
    const id='inpost-product-details-2026-10-21';
    await c.query('SELECT pg_advisory_xact_lock(hashtext($1))',[id]);
    if((await c.query('SELECT id FROM shop_data_migrations WHERE id=$1',[id])).rows.length)return;
    for(const p of seedProducts){
      const {manufacturer,manufacturerAddress,manufacturerEmail,manufacturerCountry,baseGarment,safetyInfo,composition,gpsrReady}=p;
      await c.query('UPDATE shop_products SET data=data || $2::jsonb WHERE id=$1',[p.id,JSON.stringify({manufacturer,manufacturerAddress,manufacturerEmail,manufacturerCountry,baseGarment,safetyInfo,composition,gpsrReady})]);
    }
    // Configure authorized rates. Sales is activated through the validated admin service after deployment.
    await c.query('UPDATE shop_settings SET data=data || $1::jsonb WHERE id=1',[JSON.stringify({testMode:false,codShippingPrice:2999,codSurcharge:0,courierCodConfirmed:true,lockerCodConfirmed:true,shippingReady:true,legalReady:true})]);
    await c.query('INSERT INTO shop_data_migrations(id) VALUES($1)',[id]);
    console.log('InPost COD rates and owner-confirmed product manufacturer details saved.');
  });
  const activationId='activate-authorized-inpost-sales-2026-10-21';
  if(!(await db().query('SELECT id FROM shop_data_migrations WHERE id=$1',[activationId])).rows.length){
    // User confirmed InPost, 29.99 PLN total COD shipping, and own-brand printed products.
    // Reuse the normal validation for manufacturer data, stock, legal details and email configuration.
    const current=await getSettings();
    await saveSettings({...current,testMode:false,salesActive:true,codActive:true,stripeActive:false,courierActive:true,lockerActive:true,courierCodConfirmed:true,lockerCodConfirmed:true,codShippingPrice:2999,codSurcharge:0});
    await db().query('INSERT INTO shop_data_migrations(id) VALUES($1) ON CONFLICT DO NOTHING',[activationId]);
    console.log('Validated live InPost COD sales activated at 29.99 PLN total shipping.');
  }
  await db().end();
}
