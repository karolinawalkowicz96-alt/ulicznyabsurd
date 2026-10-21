import type { ShopProduct } from './shop-types';
export const siteOrigin = 'https://www.ulicznyabsurd.pl';
export const productTitle = (p: ShopProduct) => `Śmieszna koszulka „${p.name}”`;
export const productDescription = (p: ShopProduct) => `Śmieszna koszulka „${p.name}” — prezent z humorem. Biała, 100% bawełna, rozmiary S–XXL. Oryginalny nadruk Uliczny Absurd.`;
export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
