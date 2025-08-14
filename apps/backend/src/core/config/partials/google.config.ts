import type { OAuthConfig } from '../types'
import process from 'node:process'
import { registerAs } from '@nestjs/config'

export default registerAs('google', (): OAuthConfig => ({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}))
