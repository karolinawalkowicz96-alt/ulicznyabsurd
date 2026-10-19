import { db,transaction } from '../lib/shop-db';
import { seedProducts,defaultSettings } from '../lib/shop-seed';
import { passwordHash,passwordMatches } from '../lib/shop-auth';
import { readFile } from 'node:fs/promises';
if(process.env.SHOP_INITIALIZE==='1'){
 if(!process.env.DATABASE_URL||!process.env.ADMIN_EMAIL||!process.env.ADMIN_PASSWORD||process.env.ADMIN_PASSWORD.length<14)throw new Error('Missing bootstrap configuration');
 const email=process.env.ADMIN_EMAIL.toLowerCase();
 const encoded=passwordHash(process.env.ADMIN_PASSWORD);
 if(!passwordMatches(process.env.ADMIN_PASSWORD,encoded))throw new Error('Password hash verification failed');
 await db().query(await readFile(new URL('../db/001-shop.sql',import.meta.url),'utf8'));
 await transaction(async c=>{
  const existing=await c.query('SELECT id FROM shop_settings WHERE id=1 FOR UPDATE');
  if(existing.rows.length)throw new Error('Bootstrap requires a new empty shop; refusing to overwrite existing data');
  await c.query('INSERT INTO shop_settings(id,data) VALUES(1,$1)',[JSON.stringify(defaultSettings)]);
  for(const original of seedProducts){
   const p={...original,variants:original.variants.map(v=>({...v,stock:10}))};
   await c.query('INSERT INTO shop_products(id,slug,data) VALUES($1,$2,$3)',[p.id,p.slug,JSON.stringify(p)]);
   for(const v of p.variants)await c.query('INSERT INTO shop_variants(product_id,size,stock,test_stock) VALUES($1,$2,10,10)',[p.id,v.size]);
  }
  await c.query('INSERT INTO shop_admins(email,password_hash) VALUES($1,$2)',[email,encoded]);
  const r=(await c.query('SELECT count(*)::int AS variants,sum(stock)::int AS stock,sum(test_stock)::int AS test_stock FROM shop_variants')).rows[0];
  if(r.variants!==40||r.stock!==400||r.test_stock!==400)throw new Error('Inventory verification failed');
  console.log('SHOP_BOOTSTRAP_OK: 8 products, 40 variants, 400 real and 400 test units; administrator password hash verified.');
 });
 await db().end();
}
