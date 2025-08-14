import * as v from 'valibot'

export const userProfileSchema = v.object({
  fullName: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
})

export type UserProfileInput = v.InferInput<typeof userProfileSchema>
export type UserProfileOutput = v.InferOutput<typeof userProfileSchema>

export type { UserProfileOutput as UserProfile }
