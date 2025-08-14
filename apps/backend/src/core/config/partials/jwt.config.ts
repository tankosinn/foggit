import type { JwtConfig } from '../types'
import process from 'node:process'
import { registerAs } from '@nestjs/config'

export default registerAs('jwt', (): JwtConfig => ({
  accessToken: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    expiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    expiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
  },
  resetPassword: {
    secret: process.env.JWT_RESET_PASSWORD_SECRET,
    expiration: process.env.JWT_RESET_PASSWORD_EXPIRATION,
  },
}))
