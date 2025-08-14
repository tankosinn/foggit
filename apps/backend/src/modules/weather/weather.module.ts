import { OpenWeatherModule } from '@app/integrations/openweather'
import { Module } from '@nestjs/common'
import { WeatherCache } from './cache'
import { WeatherController } from './weather.controller'
import { WeatherService } from './weather.service'

@Module({
  imports: [OpenWeatherModule],
  controllers: [WeatherController],
  providers: [WeatherCache, WeatherService],
})
export class WeatherModule {}
