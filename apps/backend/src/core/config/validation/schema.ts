import * as v from 'valibot'

export const environmentSchema = v.object({
  NODE_ENV: v.optional(v.picklist(['development', 'production', 'test', 'provision']), 'development'),
  PORT: v.optional(v.string(), '8000'),
  DATABASE_URL: v.string(),
  REDIS_URL: v.string(),
  CACHE_TTL: v.optional(v.string(), '1d'),
  CLIENT_URL: v.string(),
  JWT_ACCESS_TOKEN_SECRET: v.string(),
  JWT_ACCESS_TOKEN_EXPIRATION: v.optional(v.string(), '1w'),
  JWT_REFRESH_TOKEN_SECRET: v.string(),
  JWT_REFRESH_TOKEN_EXPIRATION: v.optional(v.string(), '1y'),
  JWT_RESET_PASSWORD_SECRET: v.string(),
  JWT_RESET_PASSWORD_EXPIRATION: v.optional(v.string(), '30m'),
  GOOGLE_CLIENT_ID: v.string(),
  GOOGLE_CLIENT_SECRET: v.string(),
  GOOGLE_CALLBACK_URL: v.string(),
  MICROSOFT_CLIENT_ID: v.string(),
  MICROSOFT_CLIENT_SECRET: v.string(),
  MICROSOFT_CALLBACK_URL: v.string(),
  MAIL_HOST: v.string(),
  MAIL_PORT: v.optional(v.string(), '465'),
  MAIL_USERNAME: v.string(),
  MAIL_PASSWORD: v.string(),
  OPENWEATHER_API_KEY: v.string(),
})

export type EnvironmentSchema = v.InferOutput<typeof environmentSchema>
