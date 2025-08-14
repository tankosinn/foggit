import type { Request } from 'express'
import { IStore, Store } from '@app/core/store'
import { User } from '@generated/prisma'
import { Inject, UnauthorizedException } from '@nestjs/common'
import { CLS_REQ } from 'nestjs-cls'
import { UserService } from '../user.service'

@Store()
export class UserStore implements IStore {
  private user: User | undefined = undefined

  constructor(
    @Inject(CLS_REQ) private readonly req: Request,
    private readonly userService: UserService,
  ) {}

  async use() {
    if (this.user !== undefined) {
      return this.user
    }

    const userPayload = this.req.user!

    const user = await this.userService.me(userPayload)
    if (!user) {
      throw new UnauthorizedException()
    }

    this.user = user

    return user
  }
}
