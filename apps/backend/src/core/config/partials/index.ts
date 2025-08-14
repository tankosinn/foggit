import type { ConfigFactory } from '@nestjs/config'
import type { ConfigPartials } from '../types'
import googleConfig from './google.config'
import jwtConfig from './jwt.config'
import mailConfig from './mail.config'
import microsoftConfig from './microsoft.config'

export const partials: ConfigFactory<ConfigPartials[keyof ConfigPartials]>[] = [
  jwtConfig,
  googleConfig,
  microsoftConfig,
  mailConfig,
]
