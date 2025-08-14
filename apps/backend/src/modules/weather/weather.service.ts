import type { WorkspaceMember } from '@generated/prisma'
import { CaslAbilityStore } from '@app/core/casl'
import { accessibleBy } from '@app/core/casl/casl-prisma.integration'
import { PrismaService } from '@app/core/database'
import { OpenWeatherService } from '@app/integrations/openweather'
import { JsonObject } from '@generated/prisma/runtime/library'
import { Injectable } from '@nestjs/common'
import { QueryCurrentWeather } from 'schemas'
import { WeatherCache } from './cache'

@Injectable()
export class WeatherService {
  constructor(
    private readonly openWeatherService: OpenWeatherService,
    private readonly weatherCache: WeatherCache,
    private readonly prisma: PrismaService,
    private readonly caslAbilityStore: CaslAbilityStore,
  ) {}

  async current(query: QueryCurrentWeather, member: WorkspaceMember) {
    const cachedWeather = await this.weatherCache.get(query.lat, query.lon)
    if (cachedWeather) {
      return cachedWeather
    }

    const weather = await this.openWeatherService.current(query)
    await this.weatherCache.set(query.lat, query.lon, weather)

    await this.prisma.weatherLog.create({
      data: {
        workspaceMemberId: member.id,
        query,
        weather: weather as unknown as JsonObject,
      },
    })

    return weather
  }

  async logs() {
    const ability = await this.caslAbilityStore.use()
    return this.prisma.weatherLog.findMany({
      where: accessibleBy(ability).WeatherLog,
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
