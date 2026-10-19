import { readFile } from 'node:fs/promises';
import { db,transaction } from '../lib/shop-db';
import { seedProducts,defaultSettings } from '../lib/shop-seed';
import { passwordHash } from '../lib/shop-auth';
if(!process.env.DATABASE_URL)throw new Error('Ustaw DATABASE_URL.');
await db().query(await readFile(new URL('../db/001-shop.sql',import.meta.url),'utf8'));
await transaction(async c=>{await c.query('INSERT INTO shop_settings(id,data) VALUES(1,$1) ON CONFLICT DO NOTHING',[JSON.stringify(defaultSettings)]);for(const p of seedProducts){await c.query('INSERT INTO shop_products(id,slug,data) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[p.id,p.slug,JSON.stringify(p)]);for(const v of p.variants)await c.query('INSERT INTO shop_variants(product_id,size,stock) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[p.id,v.size,v.stock]);}});
if(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD){if(process.env.ADMIN_PASSWORD.length<14)throw new Error('Hasło administratora musi mieć minimum 14 znaków.');await db().query('INSERT INTO shop_admins(email,password_hash) VALUES($1,$2) ON CONFLICT(email) DO UPDATE SET password_hash=$2',[process.env.ADMIN_EMAIL.toLowerCase(),passwordHash(process.env.ADMIN_PASSWORD)]);console.log('Konto administratora utworzone/zaktualizowane. Usuń ADMIN_PASSWORD ze środowiska.');}
console.log('Migracja i seed zakończone. TEST jest domyślny; fizyczne stany pozostają niezatwierdzone.');await db().end();
