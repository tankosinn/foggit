import { Config } from '@app/core/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserPayload } from '../types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService<Config, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => JwtStrategy.fromCookie(req)]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    })
  }

  private static fromCookie(req: Request): string | null {
    return req.cookies.accessToken ?? null
  }

  async validate(req: Request, payload: UserPayload) {
    return payload
  }
}
