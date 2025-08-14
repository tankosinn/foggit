import type { JsonObject } from '@prisma/client/runtime/library'
import type { CreateWorkspace, SetOnboardingState, UserProfile } from 'schemas'
import { OnboardingStep, Role } from '@generated/prisma'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Response } from 'express'
import { AuthService, UserPayload } from '../auth'
import { PrismaService } from '../database'

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async setState(userPayload: UserPayload, state: SetOnboardingState) {
    const { email } = userPayload
    const { step, data } = state

    await this.prisma.onboarding.upsert({
      where: { email_step: { email, step } },
      create: { email, step, data },
      update: { data },
    })
  }

  async getStatus(userPayload: UserPayload) {
    const { email } = userPayload

    const onboarding = await this.prisma.onboarding.findMany({
      where: {
        email,
      },
      select: { step: true, data: true },
    })

    return Object.values(OnboardingStep).reduce((acc, step) => {
      acc[step] = (onboarding.find(s => s.step === step)?.data as JsonObject) ?? null
      return acc
    }, {} as Record<OnboardingStep, JsonObject | null>)
  }

  async getState(userPayload: UserPayload, step: OnboardingStep) {
    const onboarding = await this.prisma.onboarding.findUnique({
      where: { email_step: { email: userPayload.email, step } },
    })
    return onboarding?.data
  }

  async complete(userPayload: UserPayload, res: Response) {
    const status = await this.getStatus(userPayload)

    const uncompletedSteps = Object.values(OnboardingStep).filter(step => !status[step])

    if (uncompletedSteps.length > 0) {
      throw new BadRequestException('Onboarding in progress')
    }

    const { email } = userPayload

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          ...status.PROFILE as UserProfile,
        },
      })

      const workspace = await tx.workspace.create({
        data: status.WORKSPACE as CreateWorkspace,
      })

      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id,
          role: Role.ADMIN,
        },
      })

      await tx.onboarding.deleteMany({ where: { email } })

      await this.auth.authenticateUser(user, res, true)
    })
  }
}
