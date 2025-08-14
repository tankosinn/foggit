import type { AuthCredentials, LoginOptions, ResetPassword } from 'schemas'
import { OtpService } from '@app/common/services'
import { Config, JwtConfig } from '@app/core/config'
import { PrismaService } from '@app/core/database'
import { User } from '@generated/prisma'
import { MailerService } from '@nestjs-modules/mailer'
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'
import { CookieOptions, Response } from 'express'
import ms, { StringValue } from 'ms'
import { Profile } from 'passport'
import { ResetPasswordPayload, UserPayload } from './types'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
    private readonly config: ConfigService<Config, true>,
    private readonly jwt: JwtService,
    private readonly otp: OtpService,
  ) {}

  private async validateUser(authCredentials: AuthCredentials) {
    const { email, password } = authCredentials

    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user || user.password == null) {
      const isTemporaryPasswordValid = await this.otp.validate('auth', email, password)

      if (!isTemporaryPasswordValid) {
        return null
      }

      if (user) {
        return user
      }

      return { email, requiresOnboarding: true } satisfies UserPayload
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
      return null
    }

    return user
  }

  async validateOAuthUser(profile: Profile) {
    const email = profile.emails?.[0].value

    if (email == null) {
      throw new BadRequestException('Invalid profile data')
    }

    const user = await this.prisma.user.findUnique({ where: { email } })

    if (user) {
      return user
    }

    await this.prisma.onboarding.upsert({
      where: { email_step: { email, step: 'PROFILE' } },
      create: {
        email,
        step: 'PROFILE',
        data: {
          fullName: profile.displayName,
        },
      },
      update: {},
    })

    return { email, requiresOnboarding: true } satisfies UserPayload
  }

  async getLoginOptions(loginOptions: LoginOptions) {
    const user = await this.prisma.user.findUnique({ where: loginOptions })

    return {
      hasAccount: !!user,
      passwordSignIn: user ? user.password != null : undefined,
    }
  }

  async sendTemporaryPassword(loginOptions: LoginOptions) {
    const { email } = loginOptions

    const temporaryPassword = await this.otp.create('auth', email)

    void this.mailer.sendMail({
      to: email,
      subject: 'Temporary password',
      text: `${temporaryPassword}`,
    })
  }

  async authenticateUser(user: User | UserPayload, res: Response, setRefreshToken = false) {
    const payload: UserPayload = { email: user.email }

    if ('requiresOnboarding' in user && user.requiresOnboarding) {
      payload.requiresOnboarding = true
    }
    else {
      payload.sub = (user as UserPayload).sub ?? (user as User).uuid
    }

    const jwtConfig = this.config.get<JwtConfig>('jwt')

    const cookieOptions: CookieOptions = {
      maxAge: ms(jwtConfig.accessToken.expiration as StringValue),
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'lax',
    }

    const accessToken = await this.jwt.signAsync(payload)

    res.cookie('accessToken', accessToken, cookieOptions)

    if (!setRefreshToken) {
      return
    }

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: jwtConfig.refreshToken.secret,
      expiresIn: jwtConfig.refreshToken.expiration,
    })

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: ms(jwtConfig.refreshToken.expiration as StringValue),
    })
  }

  async loginWithEmail(authCredentials: AuthCredentials, res: Response) {
    const user = await this.validateUser(authCredentials)

    if (!user) {
      throw new UnauthorizedException()
    }

    await this.authenticateUser(user, res, true)
  }

  async sendResetPasswordLink(loginOptions: LoginOptions) {
    const { email } = loginOptions

    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    if (user.password == null) {
      throw new BadRequestException('User has no password')
    }

    const token = await this.jwt.signAsync({ email }, {
      secret: this.config.get<JwtConfig>('jwt').resetPassword.secret,
      expiresIn: this.config.get<JwtConfig>('jwt').resetPassword.expiration,
    })

    const resetPasswordLink = `${this.config.get('CLIENT_URL')}/api/auth/reset-password?token=${token}`

    void this.mailer.sendMail({
      to: email,
      subject: 'Reset your password',
      text: `To reset your password, use the following link: ${resetPasswordLink}`,
    })
  }

  async resetPassword(resetPassword: ResetPassword, res: Response) {
    let email: string

    try {
      const payload = await this.jwt.verifyAsync<ResetPasswordPayload>(resetPassword.token, {
        secret: this.config.get<JwtConfig>('jwt').resetPassword.secret,
      })
      email = payload.email
    }
    catch {
      throw new BadRequestException('Invalid or expired token')
    }

    const user = await this.prisma.user.update({
      where: { email },
      data: { password: null },
    })

    await this.authenticateUser(user, res, true)
  }
}
