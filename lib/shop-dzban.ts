import { transaction } from './shop-db';
import { shopSizes, type ShopProduct } from './shop-types';

// One-time catalog addition. Later deployments must never replenish sold units.
export async function addDzbanProduct() {
  return transaction(async c => {
    const migration = 'add-dzban-roku-2026-10-25';
    await c.query('SELECT pg_advisory_xact_lock(hashtext($1))', [migration]);
    if ((await c.query('SELECT id FROM shop_data_migrations WHERE id=$1', [migration])).rows.length) return { alreadyApplied: true };
    const template = (await c.query('SELECT data FROM shop_products WHERE id=$1', ['oko-01'])).rows[0]?.data as ShopProduct | undefined;
    if (!template) throw new Error('Missing base shirt for DZBAN ROKU');
    const description = 'Tytuł zobowiązuje. Biała koszulka z dzbanem w czerwonym turbanie dla mistrzów niepoważnych akcji i dystansu do siebie. Załóż ją na spotkanie ze znajomymi albo podaruj komuś, kto zasłużył na ten tytuł. Zero powagi. Pełne uznanie.';
    const product: ShopProduct = {
      ...template, id: 'dzban-09', slug: 'dzban-roku', name: 'DZBAN ROKU', description,
      image: '/products/dzban-roku.png', images: ['/products/dzban-roku.png'],
      price: 7999, priceApproved: true, active: true, hidden: false, soldOut: false,
      sortOrder: 0, bestseller: false, isNew: true,
      seoTitle: 'DZBAN ROKU — koszulka z nadrukiem | Uliczny Absurd',
      seoDescription: description,
      variants: shopSizes.map(size => ({ size, stock: 10 })),
    };
    await c.query("UPDATE shop_products SET data=jsonb_set(data,'{sortOrder}',to_jsonb(COALESCE((data->>'sortOrder')::int,0)+1))");
    await c.query('INSERT INTO shop_products(id,slug,data) VALUES($1,$2,$3)', [product.id, product.slug, JSON.stringify(product)]);
    for (const variant of product.variants) await c.query('INSERT INTO shop_variants(product_id,size,stock,test_stock) VALUES($1,$2,$3,$3)', [product.id, variant.size, variant.stock]);
    const variants = (await c.query('SELECT size,stock FROM shop_variants WHERE product_id=$1 ORDER BY size', [product.id])).rows;
    if (variants.length !== 5 || variants.some(v => v.stock !== 10)) throw new Error('DZBAN ROKU inventory verification failed');
    await c.query('INSERT INTO shop_data_migrations(id) VALUES($1)', [migration]);
    return { alreadyApplied: false, product: product.id, variants, first: true };
  });
}
