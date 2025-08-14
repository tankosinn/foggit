import type { MailConfig } from '../types'
import process from 'node:process'
import { registerAs } from '@nestjs/config'

export default registerAs('mail', (): MailConfig => ({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
}))
