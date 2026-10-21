import type { ShopSettings } from './shop-types';

// One calculation shared by the checkout and the order API. Amounts are in grosz.
export function shippingTotal(settings: Partial<Pick<ShopSettings, 'courierPrice'|'lockerPrice'|'codSurcharge'|'codShippingPrice'>>, delivery: string, payment: string, test = false): number {
  if (delivery === 'international') return 11900;
  const base = test ? (delivery === 'locker' ? 1499 : 1899) : (delivery === 'locker' ? (settings.lockerPrice ?? 0) : (settings.courierPrice ?? 0));
  if (payment !== 'cod') return base;
  return !test && settings.codShippingPrice != null ? settings.codShippingPrice : base + (settings.codSurcharge ?? 0);
}
