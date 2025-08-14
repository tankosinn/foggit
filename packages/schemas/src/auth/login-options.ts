import * as v from 'valibot'

export const loginOptionsSchema = v.object({
  email: v.pipe(v.string(), v.email()),
})

export type LoginOptionsInput = v.InferInput<typeof loginOptionsSchema>
export type LoginOptionsOutput = v.InferOutput<typeof loginOptionsSchema>

export type { LoginOptionsOutput as LoginOptions }
