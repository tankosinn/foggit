import { Config } from '@app/core/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserPayload } from '../types'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService<Config, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => JwtRefreshStrategy.fromCookie(req)]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
    })
  }

  public static fromCookie(req: Request) {
    return req.cookies.refreshToken ?? null
  }

  async validate(payload: UserPayload) {
    return payload
  }
}
