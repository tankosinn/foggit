import { OtpService } from '@app/common/services'
import { Config, JwtConfig } from '@app/core/config'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleStrategy, JwtRefreshStrategy, JwtStrategy, MicrosoftStrategy } from './strategies'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<Config, true>,
      ) => {
        const jwtConfig = configService.get<JwtConfig>('jwt')
        return {
          secret: jwtConfig.accessToken.secret,
          signOptions: { expiresIn: jwtConfig.accessToken.expiration },
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    MicrosoftStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthService,
    ConfigService,
    OtpService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
