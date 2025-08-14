import type { FetchContext, FetchOptions } from 'ofetch'
import { Injectable } from '@nestjs/common'
import { ofetch } from 'ofetch'
import qs from 'qs'
import { OPEN_WEATHER_API_URL } from './constants'

@Injectable()
export class OpenWeatherClient {
  constructor(private readonly apiKey: string) {}

  private onRequest({ options }: FetchContext) {
    if (options.query) {
      options.query.appid = this.apiKey
      const searchParams = new URLSearchParams(qs.stringify(options.query))
      options.query = Object.fromEntries(searchParams)
    }
  }

  async get<T>(url: string, options?: Omit<FetchOptions, 'baseURL' | 'method' | 'responseType'>) {
    return ofetch<T>(url, {
      ...options,
      baseURL: OPEN_WEATHER_API_URL,
      onRequest: this.onRequest.bind(this),
    })
  }
}
