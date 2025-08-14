import { ClassTransformerInterceptor } from '@app/common/transformer'
import { createKeyv } from '@keyv/redis'
import { MailerModule } from '@nestjs-modules/mailer'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import ms, { StringValue } from 'ms'
import { ClsModule } from 'nestjs-cls'
import { AuthModule, JwtAuthGuard } from './auth'
import { PoliciesGuard } from './casl/guards'
import { Config, MailConfig, partials, validate } from './config'
import { DatabaseModule } from './database'
import { OnboardingModule } from './onboarding'
import { OnboardingGuard } from './onboarding/guards'
import { StoreModule } from './store/store.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      load: partials,
      cache: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<Config, true>) => ({
        stores: createKeyv(configService.get<string>('REDIS_URL')),
        ttl: ms(configService.get<string>('CACHE_TTL') as StringValue),
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<Config, true>) => ({
        transport: configService.get<MailConfig>('mail'),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    StoreModule,
    AuthModule,
    OnboardingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OnboardingGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassTransformerInterceptor,
    },
  ],
})
export class CoreModule {}
