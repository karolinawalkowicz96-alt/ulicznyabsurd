import type { ShopProduct } from './shop-types';
export const siteOrigin = 'https://www.ulicznyabsurd.pl';
export const productTitle = (p: ShopProduct) => `Koszulka „${p.name}” z nadrukiem`;
export const productDescription = (p: ShopProduct) => `Biała koszulka „${p.name}” z kolekcji Uliczny Absurd. 100% bawełna, rozmiary S–XXL. ${p.description}`;
export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
