import { Injectable } from '@nestjs/common'
import { QueryCurrentWeather } from 'schemas'
import { OpenWeatherClient } from './openweather.client'
import { CurrentWeather } from './types'

@Injectable()
export class OpenWeatherService {
  constructor(private readonly client: OpenWeatherClient) {}

  async current(query: QueryCurrentWeather) {
    return this.client.get<CurrentWeather>('/weather', { query })
  }
}
