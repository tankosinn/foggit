import { Config, OAuthConfig } from '@app/core/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile } from 'passport'
import { Strategy } from 'passport-microsoft'
import { AuthService } from '../auth.service'

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    private readonly configService: ConfigService<Config, true>,
    private readonly authService: AuthService,
  ) {
    super({
      ...configService.get<OAuthConfig>('microsoft'),
      scope: ['user.read'],
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return this.authService.validateOAuthUser(profile)
  }
}
