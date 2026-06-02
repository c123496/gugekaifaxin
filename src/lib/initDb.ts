import { sql } from './db';

export const DEFAULT_PROFILE = `Xinxiang Jinda Reflective Products Co., Ltd.
- 13+ years manufacturing high-visibility reflective safety apparel
- 3,000+ m² factory, 500+ employees, 1,000,000+ vests produced annually
- Serving clients in 30+ countries; trusted supplier to Costco and Huawei
- OEM/ODM customization; factory-direct pricing, competitive for 1,000+ pcs orders
- Product line: safety vests, waterproof reflective jackets, safety T-shirts, hard hats, safety shoes, workwear
- Can manufacture to ANSI/ISEA 107 and CE EN ISO 20471 standards (note: no third-party certificate yet — do NOT claim "certified")`;

export async function initDb(): Promise<void> {
  await sql`CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    contact TEXT,
    email TEXT,
    region TEXT NOT NULL,
    customer_type TEXT NOT NULL,
    source TEXT NOT NULL,
    search_category TEXT NOT NULL,
    dedupe_key TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT '待联系',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS letters (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    company_profile TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT settings_singleton CHECK (id = 1)
  )`;
  await sql`INSERT INTO settings (id, company_profile)
            VALUES (1, ${DEFAULT_PROFILE})
            ON CONFLICT (id) DO NOTHING`;
}
