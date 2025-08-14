import type { Policy } from '../types'
import { SetMetadata } from '@nestjs/common'

export const CHECK_POLICIES_KEY = 'checkPolicy'
export function CheckPolicies(...handlers: Policy[]) {
  return SetMetadata(CHECK_POLICIES_KEY, handlers)
}
