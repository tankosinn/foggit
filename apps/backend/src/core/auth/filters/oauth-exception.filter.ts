import type { Response } from 'express'
import { Config } from '@app/core/config'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Catch()
export class OAuthExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService<Config, true>) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const clientURL = this.configService.get<string>('CLIENT_URL')

    return response.redirect(`${clientURL}/api/auth/redirect?error=oauth`)
  }
}
