import * as v from 'valibot'
import { userProfileSchema } from '../user'
import { createWorkspaceSchema } from '../workspace'

export const setOnboardingStateSchema = v.variant('step', [
  v.object({
    step: v.literal('PROFILE'),
    data: userProfileSchema,
  }),
  v.object({
    step: v.literal('WORKSPACE'),
    data: createWorkspaceSchema,
  }),
])

export type SetOnboardingStateInput = v.InferInput<typeof setOnboardingStateSchema>
export type SetOnboardingStateOutput = v.InferOutput<typeof setOnboardingStateSchema>

export type { SetOnboardingStateOutput as SetOnboardingState }
