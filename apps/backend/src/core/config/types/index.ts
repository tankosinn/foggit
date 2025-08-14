import type { EnvironmentSchema } from '../validation'

export interface JwtConfig {
  accessToken: {
    secret: string
    expiration: string
  }
  refreshToken: {
    secret: string
    expiration: string
  }
  resetPassword: {
    secret: string
    expiration: string
  }
}

export interface OAuthConfig {
  clientID: string
  clientSecret: string
  callbackURL: string
}

export interface MailConfig {
  host: string
  port: number
  auth: {
    user: string
    pass: string
  }
}

export interface ConfigPartials {
  jwt: JwtConfig
  google: OAuthConfig
  microsoft: OAuthConfig
  mail: MailConfig
}

export type Config = EnvironmentSchema & ConfigPartials
