# Stripe Checkout — test payments

The storefront redirects to Stripe hosted Checkout and returns to `/zamowienie`.
The return page polls the saved order; only a signature-verified webhook marks it paid.

Production Vercel project: `ulicznyabsurd`, team `jedziemy`.

Required server-only environment variables:

- `STRIPE_CHECKOUT_ENABLED=true`
- `STRIPE_CHECKOUT_MODE=test` (rejects live API keys)
- `STRIPE_SECRET_KEY`: sandbox restricted API key (`rk_test_…`, Checkout Sessions write permissions), or a test secret key (`sk_test_…`). Never commit it.
- `STRIPE_WEBHOOK_SECRET`: signing secret of the sandbox webhook below.
- `APP_URL=https://www.ulicznyabsurd.pl`

Create the webhook in the same Stripe test environment as the key:
`https://www.ulicznyabsurd.pl/api/webhooks/stripe`

Subscribe to:
- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`

After adding credentials, redeploy the project. The payment option stays hidden until both credentials exist. Orders paid with a test key are marked TEST, use test stock, do not send transactional emails and are excluded from real revenue reporting. Existing cash-on-delivery orders remain live. Test inventory must contain stock for the purchased sizes.

Verify using Stripe's test card `4242 4242 4242 4242`, a future expiry and any three-digit CVC. Check the amount including shipping, return to the store, and the webhook-backed paid status. Also test cancellation, declined payment, and duplicate webhook delivery. Never use a real card in this workflow.

Automated local checks: `npm run typecheck`, `node --import tsx --test tests/integration.test.ts`, `next build --webpack`.

Live launch is a separate authorized change: change credentials, configure the live webhook and change `STRIPE_CHECKOUT_MODE` together. Do not merely replace the key.
