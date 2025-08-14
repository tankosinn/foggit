import type { WorkspaceMember } from '@generated/prisma'
import type { QueryCurrentWeather } from 'schemas'
import { ValidationPipe } from '@app/common/pipes'
import { UseStore } from '@app/core/store'
import { Controller, Get, Query } from '@nestjs/common'
import { queryCurrentWeatherSchema } from 'schemas'
import { MemberStore } from '../member'
import { WeatherService } from './weather.service'

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async current(
    @Query(new ValidationPipe(queryCurrentWeatherSchema)) query: QueryCurrentWeather,
    @UseStore(MemberStore) member: WorkspaceMember,
  ) {
    return this.weatherService.current(query, member)
  }

  @Get('log')
  async logs() {
    return this.weatherService.logs()
  }
}
