import * as v from 'valibot'

export const queryCurrentWeatherSchema = v.object({
  lat: v.pipe(v.union([v.number(), v.string()]), v.transform(Number)),
  lon: v.pipe(v.union([v.number(), v.string()]), v.transform(Number)),
  units: v.optional(v.picklist(['standard', 'metric', 'imperial'])),
  lang: v.optional(v.string())
})

export type QueryCurrentWeatherInput = v.InferInput<typeof queryCurrentWeatherSchema>
export type QueryCurrentWeatherOutput = v.InferOutput<typeof queryCurrentWeatherSchema>

export type { QueryCurrentWeatherOutput as QueryCurrentWeather }
