import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CHECK_POLICIES_KEY } from '../decorators'
import { CaslAbilityStore } from '../store'
import { Policy } from '../types'

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly caslAbilityStore: CaslAbilityStore,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policies = this.reflector.get<Policy[]>(CHECK_POLICIES_KEY, context.getHandler()) ?? []

    if (policies.length === 0) {
      return true
    }

    const ability = await this.caslAbilityStore.use()
    return policies.every(policy => ability.can(...policy))
  }
}
