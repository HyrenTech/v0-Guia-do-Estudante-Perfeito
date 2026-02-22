import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),

  APP_TIMEZONE: z.string().default("America/Sao_Paulo"),
  APP_CURRENCY: z.string().default("BRL"),

  INTERNAL_BASIC_AUTH_USER: z.string().optional(),
  INTERNAL_BASIC_AUTH_PASSWORD: z.string().optional(),
  INTERNAL_SYNC_SECRET: z.string().optional(),
  CRON_SECRET: z.string().optional(),

  META_BASE_URL: z.string().url().default("https://graph.facebook.com"),
  META_API_VERSION: z.string().default("v22.0"),
  META_ACCESS_TOKEN: z.string().optional(),
  META_AD_ACCOUNT_ID: z.string().optional(),
  META_ACCOUNT_NAME: z.string().default("Meta Account"),
  META_CURRENCY: z.string().default("USD"),

  HOTMART_WEBHOOK_SECRET: z.string().optional(),
  HOTMART_API_BASE_URL: z.string().url().default("https://developers.hotmart.com"),
  HOTMART_ORDERS_ENDPOINT: z.string().default("/payments/api/v1/sales/history"),
  HOTMART_ACCESS_TOKEN: z.string().optional(),
  HOTMART_OAUTH_URL: z.string().url().default("https://api-sec-vlc.hotmart.com/security/oauth/token"),
  HOTMART_CLIENT_ID: z.string().optional(),
  HOTMART_CLIENT_SECRET: z.string().optional(),
  HOTMART_BASIC_AUTH: z.string().optional(),

  ALERT_HIGH_SPEND_THRESHOLD: z.coerce.number().default(100),
})

export type AppEnv = z.infer<typeof envSchema>

let envCache: AppEnv | null = null

export function getEnv(): AppEnv {
  if (envCache) return envCache
  envCache = envSchema.parse(process.env)
  return envCache
}

type RequiredEnvSubset<K extends keyof AppEnv> = {
  [P in K]-?: NonNullable<AppEnv[P]>
}

export function requireEnv<K extends keyof AppEnv>(keys: K[]): RequiredEnvSubset<K> {
  const env = getEnv()
  const missing = keys.filter((key) => !env[key])

  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(", ")}`)
  }

  return keys.reduce((acc, key) => {
    acc[key] = env[key] as RequiredEnvSubset<K>[K]
    return acc
  }, {} as RequiredEnvSubset<K>)
}
