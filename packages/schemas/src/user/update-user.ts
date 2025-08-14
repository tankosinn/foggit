import * as v from 'valibot'
import { userProfileSchema } from './user-profile'

export const updateUserSchema = v.partial(userProfileSchema)

export type UpdateUserInput = v.InferInput<typeof updateUserSchema>
export type UpdateUserOutput = v.InferOutput<typeof updateUserSchema>

export type { UpdateUserOutput as UpdateUser }
