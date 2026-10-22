import type { ShopSettings } from './shop-types';

export function stripeKeyMode(key = process.env.STRIPE_SECRET_KEY): 'test' | 'live' | null {
  if (/^(sk|rk)_test_\S+$/.test(key || '')) return 'test';
  if (/^(sk|rk)_live_\S+$/.test(key || '')) return 'live';
  return null;
}

// Live credentials are allowed only in Vercel Production or isolated local tests.
// No option is advertised until both the API key and signed webhook are configured.
export function paymentSettings(settings: ShopSettings): ShopSettings {
  const mode = stripeKeyMode();
  const requested = process.env.STRIPE_CHECKOUT_MODE;
  const compatible = !requested || requested === mode;
  const production = process.env.VERCEL_ENV === 'production';
  const isolatedTest = process.env.NODE_ENV === 'test' && !process.env.VERCEL_ENV;
  const environmentSafe = mode === 'live' ? production || isolatedTest : !production;
  const configured = Boolean(mode && compatible && environmentSafe && process.env.STRIPE_WEBHOOK_SECRET);
  return {
    ...settings,
    testMode: production ? false : settings.testMode,
    codActive: settings.codActive && process.env.COD_CHECKOUT_ENABLED !== 'false',
    stripeActive: configured && (settings.stripeActive || process.env.STRIPE_CHECKOUT_ENABLED === 'true'),
    stripeTestMode: mode === 'test',
  };
}
