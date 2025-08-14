import { IS_PUBLIC_KEY } from '@app/core/auth'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { IS_ONBOARDING_KEY } from '../decorators'

@Injectable()
export class OnboardingGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const isOnboarding = this.reflector.getAllAndOverride<boolean>(IS_ONBOARDING_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const req = context.switchToHttp().getRequest<Request>()

    if (isOnboarding !== req.user!.requiresOnboarding) {
      throw new ForbiddenException(isOnboarding ? 'Onboarding completed' : 'Onboarding not completed')
    }

    return true
  }
}
