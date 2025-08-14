export interface Coordinates {
  lon: number
  lat: number
}

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface MainWeather {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level?: number
  grnd_level?: number
}

export interface Wind {
  speed: number
  deg: number
  gust?: number
}

export interface Clouds {
  all: number
}

export interface Precipitation {
  '1h'?: number
  '3h'?: number
}

export interface SystemInfo {
  type?: number
  id?: number
  message?: number
  country?: string
  sunrise?: number
  sunset?: number
}

export interface CurrentWeather {
  coord: Coordinates
  weather: WeatherCondition[]
  base?: string
  main: MainWeather
  visibility?: number
  wind?: Wind
  rain?: Precipitation
  snow?: Precipitation
  clouds?: Clouds
  dt: number
  sys?: SystemInfo
  timezone: number
  id: number
  name: string
  cod: number
}
