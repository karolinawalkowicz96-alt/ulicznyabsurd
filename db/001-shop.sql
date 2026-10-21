CREATE TABLE IF NOT EXISTS shop_products (id text PRIMARY KEY, slug text UNIQUE NOT NULL, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS shop_variants (product_id text REFERENCES shop_products(id) ON DELETE CASCADE, size text CHECK(size IN ('S','M','L','XL','XXL')), stock integer CHECK(stock>=0), test_stock integer NOT NULL DEFAULT 100 CHECK(test_stock>=0), PRIMARY KEY(product_id,size));
CREATE TABLE IF NOT EXISTS shop_settings (id integer PRIMARY KEY CHECK(id=1), data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS shop_orders (id uuid PRIMARY KEY, number text UNIQUE NOT NULL, token_hash text UNIQUE NOT NULL, idempotency_key text UNIQUE NOT NULL, request_hash text NOT NULL, data jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS shop_admins (email text PRIMARY KEY, password_hash text NOT NULL);
CREATE TABLE IF NOT EXISTS shop_sessions (token_hash text PRIMARY KEY, email text REFERENCES shop_admins(email), expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS shop_rate_limits (key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS shop_outbox (id uuid PRIMARY KEY, order_id uuid REFERENCES shop_orders(id), recipient text NOT NULL, event text NOT NULL, status text NOT NULL DEFAULT 'pending', attempts integer NOT NULL DEFAULT 0, error text, available_at timestamptz NOT NULL DEFAULT now(), sent_at timestamptz);
CREATE TABLE IF NOT EXISTS shop_ledger (id uuid PRIMARY KEY, order_id uuid REFERENCES shop_orders(id), amount integer NOT NULL, recognized_at timestamptz NOT NULL DEFAULT now(), note text NOT NULL, test_mode boolean NOT NULL);
CREATE INDEX IF NOT EXISTS shop_orders_created_idx ON shop_orders(created_at);
CREATE INDEX IF NOT EXISTS shop_outbox_pending_idx ON shop_outbox(status,available_at);

ALTER TABLE shop_outbox ADD COLUMN IF NOT EXISTS payload text;
ALTER TABLE shop_outbox ADD COLUMN IF NOT EXISTS provider_id text;
