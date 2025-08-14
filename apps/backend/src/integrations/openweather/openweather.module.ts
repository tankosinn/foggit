import { Config } from '@app/core/config'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { OpenWeatherClient } from './openweather.client'
import { OpenWeatherService } from './openweather.service'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: OpenWeatherClient,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config, true>) => new OpenWeatherClient(configService.get<string>('OPENWEATHER_API_KEY')),
    },
    OpenWeatherService,
  ],
  exports: [OpenWeatherService],
})
export class OpenWeatherModule {}
