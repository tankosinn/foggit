import type { OAuthConfig } from '../types'
import process from 'node:process'
import { registerAs } from '@nestjs/config'

export default registerAs('microsoft', (): OAuthConfig => ({
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  callbackURL: process.env.MICROSOFT_CALLBACK_URL,
}))
