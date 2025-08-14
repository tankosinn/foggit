import * as v from 'valibot'

export const resetPasswordSchema = v.object({
  token: v.pipe(v.string(), v.minLength(1)),
})

export type ResetPasswordInput = v.InferInput<typeof resetPasswordSchema>
export type ResetPasswordOutput = v.InferOutput<typeof resetPasswordSchema>

export type { ResetPasswordOutput as ResetPassword }
