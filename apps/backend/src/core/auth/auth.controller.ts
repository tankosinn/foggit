import type { Request, Response } from 'express'
import type { AuthCredentials, LoginOptions, ResetPassword } from 'schemas'
import { ValidationPipe } from '@app/common/pipes'
import { Body, Controller, Get, Post, Req, Res, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common'
import { authCredentialsSchema, loginOptionsSchema, resetPasswordSchema } from 'schemas'
import { AuthService } from './auth.service'
import { Public } from './decorators'
import { OAuthExceptionFilter } from './filters'
import { GoogleAuthGuard, JwtRefreshAuthGuard, MicrosoftAuthGuard } from './guards'
import { OAuthInterceptor } from './interceptors'

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('get-login-options')
  async getLoginOptions(@Body(new ValidationPipe(loginOptionsSchema)) loginOptions: LoginOptions) {
    return this.authService.getLoginOptions(loginOptions)
  }

  @Post('send-temporary-password')
  async sendTemporaryPassword(@Body(new ValidationPipe(loginOptionsSchema)) loginOptions: LoginOptions) {
    return this.authService.sendTemporaryPassword(loginOptions)
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @UseFilters(OAuthExceptionFilter)
  @UseInterceptors(OAuthInterceptor)
  async loginWithGoogleCallback() {}

  @Get('microsoft')
  @UseGuards(MicrosoftAuthGuard)
  async loginWithMicrosoft() {}

  @Get('microsoft/callback')
  @UseGuards(MicrosoftAuthGuard)
  @UseFilters(OAuthExceptionFilter)
  @UseInterceptors(OAuthInterceptor)
  async loginWithMicrosoftCallback() {}

  @Post('login-with-email')
  async loginWithEmail(
    @Body(new ValidationPipe(authCredentialsSchema)) authCredentials: AuthCredentials,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.loginWithEmail(authCredentials, res)
  }

  @Get('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.authenticateUser(req.user!, res)
  }

  @Post('send-reset-password-link')
  async sendResetPasswordLink(@Body(new ValidationPipe(loginOptionsSchema)) loginOptions: LoginOptions) {
    return this.authService.sendResetPasswordLink(loginOptions)
  }

  @Post('reset-password')
  async resetPassword(
    @Body(new ValidationPipe(resetPasswordSchema)) resetPassword: ResetPassword,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.resetPassword(resetPassword, response)
  }
}
