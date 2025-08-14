import * as v from 'valibot'

export const authCredentialsSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
})

export type AuthCredentialsInput = v.InferInput<typeof authCredentialsSchema>
export type AuthCredentialsOutput = v.InferOutput<typeof authCredentialsSchema>

export type { AuthCredentialsOutput as AuthCredentials }
