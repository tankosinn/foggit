import { SetMetadata } from '@nestjs/common'

export const IS_ONBOARDING_KEY = 'isOnboarding'
export const Onboarding = () => SetMetadata(IS_ONBOARDING_KEY, true)
