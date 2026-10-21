import type { ShopSettings } from './shop-types';

export function stripeKeyMode(key = process.env.STRIPE_SECRET_KEY): 'test' | 'live' | null {
  if (/^(sk|rk)_test_\S+$/.test(key || '')) return 'test';
  if (/^(sk|rk)_live_\S+$/.test(key || '')) return 'live';
  return null;
}

// Test checkout can coexist with real cash-on-delivery orders.
// No option is advertised until both the API key and signed webhook are configured.
export function paymentSettings(settings: ShopSettings): ShopSettings {
  const mode = stripeKeyMode();
  const requested = process.env.STRIPE_CHECKOUT_MODE;
  const compatible = !requested || requested === mode;
  const configured = Boolean(mode && compatible && process.env.STRIPE_WEBHOOK_SECRET);
  return {
    ...settings,
    stripeActive: configured && (settings.stripeActive || process.env.STRIPE_CHECKOUT_ENABLED === 'true'),
    stripeTestMode: mode === 'test',
  };
}
