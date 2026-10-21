import type { ShopProduct } from './shop-types';
export const siteOrigin = 'https://www.ulicznyabsurd.pl';
export const productTitle = (p: ShopProduct) => `Śmieszna koszulka „${p.name}”`;
export const productDescription = (p: ShopProduct) => `Śmieszna koszulka „${p.name}”. Autorski nadruk Uliczny Absurd i pomysł na prezent dla kogoś, kto lubi dobry humor.`;
export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
