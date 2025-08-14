import type { Cache } from 'cache-manager'
import { CurrentWeather } from '@app/integrations/openweather'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { CACHE_TTL, TILE_SIZE } from '../constants'

@Injectable()
export class WeatherCache {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  tileKey(lat: number, lon: number) {
    const clampedLat = Math.max(-90, Math.min(90, lat))
    const normalizedLon = ((lon + 180) % 360 + 360) % 360 - 180

    const KM_PER_DEG_LAT = 110.574
    const phi = clampedLat * Math.PI / 180
    const kmPerDegLon = Math.max(0.001, Math.abs(111.320 * Math.cos(phi)))

    const latBucketSizeDeg = TILE_SIZE / KM_PER_DEG_LAT
    const lonBucketSizeDeg = TILE_SIZE / kmPerDegLon

    const latBucket = Math.floor(clampedLat / latBucketSizeDeg)
    const lonBucket = Math.floor(normalizedLon / lonBucketSizeDeg)

    return `weather:${latBucket}:${lonBucket}`
  }

  async get(lat: number, lon: number) {
    return this.cacheManager.get<CurrentWeather>(this.tileKey(lat, lon))
  }

  async set(lat: number, lon: number, weather: CurrentWeather) {
    return this.cacheManager.set(this.tileKey(lat, lon), weather, CACHE_TTL)
  }

  async del(lat: number, lon: number) {
    return this.cacheManager.del(this.tileKey(lat, lon))
  }
}
