import { Config } from '@app/core/config'
import { User } from '@generated/prisma'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { Observable } from 'rxjs'
import { AuthService } from '../auth.service'
import { UserPayload } from '../types'

@Injectable()
export class OAuthInterceptor implements NestInterceptor {
  constructor(
    private readonly configService: ConfigService<Config, true>,
    private readonly authService: AuthService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()

    const user = req.user as User | UserPayload
    await this.authService.authenticateUser(user, res, true)
    const clientURL = this.configService.get<string>('CLIENT_URL')

    res.redirect(`${clientURL}/api/auth/redirect`)

    return next.handle()
  }
}
