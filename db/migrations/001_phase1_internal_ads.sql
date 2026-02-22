CREATE TABLE IF NOT EXISTS platform_accounts (
  id BIGSERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  platform_account_id TEXT NOT NULL,
  name TEXT NOT NULL,
  currency TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (platform, platform_account_id)
);

CREATE TABLE IF NOT EXISTS campaigns (
  id BIGSERIAL PRIMARY KEY,
  platform_campaign_id TEXT NOT NULL UNIQUE,
  account_id BIGINT NOT NULL REFERENCES platform_accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  objective TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ad_sets (
  id BIGSERIAL PRIMARY KEY,
  platform_ad_set_id TEXT NOT NULL UNIQUE,
  campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  daily_budget NUMERIC(14, 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ads (
  id BIGSERIAL PRIMARY KEY,
  platform_ad_id TEXT NOT NULL UNIQUE,
  ad_set_id BIGINT NOT NULL REFERENCES ad_sets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  creative_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meta_insights_hourly (
  id BIGSERIAL PRIMARY KEY,
  account_id BIGINT NOT NULL REFERENCES platform_accounts(id) ON DELETE CASCADE,
  campaign_id BIGINT REFERENCES campaigns(id) ON DELETE SET NULL,
  ad_set_id BIGINT REFERENCES ad_sets(id) ON DELETE SET NULL,
  ad_id BIGINT NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  date_hour TIMESTAMPTZ NOT NULL,
  spend NUMERIC(14, 4) NOT NULL DEFAULT 0,
  impressions BIGINT NOT NULL DEFAULT 0,
  clicks BIGINT NOT NULL DEFAULT 0,
  cpm NUMERIC(14, 4) NOT NULL DEFAULT 0,
  cpc NUMERIC(14, 4) NOT NULL DEFAULT 0,
  ctr NUMERIC(14, 4) NOT NULL DEFAULT 0,
  initiate_checkout NUMERIC(14, 4) NOT NULL DEFAULT 0,
  purchase_meta NUMERIC(14, 4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (ad_id, date_hour)
);

CREATE TABLE IF NOT EXISTS hotmart_orders (
  id BIGSERIAL PRIMARY KEY,
  hotmart_order_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL,
  order_created_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  currency TEXT,
  gross_value NUMERIC(14, 4) NOT NULL DEFAULT 0,
  net_value NUMERIC(14, 4) NOT NULL DEFAULT 0,
  product_name TEXT,
  offer_code TEXT,
  buyer_hash TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (hotmart_order_id, event_type)
);

CREATE TABLE IF NOT EXISTS daily_facts (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  account_id BIGINT NOT NULL REFERENCES platform_accounts(id) ON DELETE CASCADE,
  spend_meta NUMERIC(14, 4) NOT NULL DEFAULT 0,
  checkouts_meta NUMERIC(14, 4) NOT NULL DEFAULT 0,
  purchases_meta NUMERIC(14, 4) NOT NULL DEFAULT 0,
  sales_hotmart INT NOT NULL DEFAULT 0,
  revenue_hotmart NUMERIC(14, 4) NOT NULL DEFAULT 0,
  cpa_real NUMERIC(14, 4),
  roas_real NUMERIC(14, 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (date, account_id)
);

CREATE TABLE IF NOT EXISTS alerts (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  entity_type TEXT NOT NULL DEFAULT '',
  entity_id TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (type, entity_type, entity_id, status)
);

CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);

CREATE TABLE IF NOT EXISTS sync_runs (
  id BIGSERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running',
  records_upserted INT NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_runs_source ON sync_runs(source);
CREATE INDEX IF NOT EXISTS idx_sync_runs_started_at ON sync_runs(started_at DESC);

CREATE TABLE IF NOT EXISTS fx_rates (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  base_currency TEXT NOT NULL,
  quote_currency TEXT NOT NULL,
  rate NUMERIC(14, 6) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (date, base_currency, quote_currency)
);

CREATE INDEX IF NOT EXISTS idx_meta_insights_date_hour ON meta_insights_hourly(date_hour);
CREATE INDEX IF NOT EXISTS idx_daily_facts_date ON daily_facts(date);
CREATE INDEX IF NOT EXISTS idx_hotmart_approved ON hotmart_orders(approved_at);
