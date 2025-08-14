import type { Request, Response } from 'express'
import type { SetOnboardingState } from 'schemas'
import { ValidationPipe } from '@app/common/pipes'
import { OnboardingStep } from '@generated/prisma'
import { Body, Controller, Get, Param, ParseEnumPipe, Post, Put, Req, Res } from '@nestjs/common'
import { setOnboardingStateSchema } from 'schemas'
import { Onboarding } from './decorators'
import { OnboardingService } from './onboarding.service'

@Onboarding()
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Put()
  async setState(
    @Req() req: Request,
    @Body(new ValidationPipe(setOnboardingStateSchema)) state: SetOnboardingState,
  ) {
    return this.onboardingService.setState(req.user!, state)
  }

  @Get()
  async getStatus(@Req() req: Request) {
    return this.onboardingService.getStatus(req.user!)
  }

  @Get(':step')
  async getState(
    @Req() req: Request,
    @Param('step', new ParseEnumPipe(OnboardingStep)) step: OnboardingStep,
  ) {
    return this.onboardingService.getState(req.user!, step)
  }

  @Post('complete')
  async complete(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.onboardingService.complete(req.user!, res)
  }
}
