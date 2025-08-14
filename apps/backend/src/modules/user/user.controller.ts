import type { User } from '@generated/prisma'
import type { UpdateUser, UpdateUserPassword } from 'schemas'
import { ValidationPipe } from '@app/common/pipes'
import { TransformerOptions } from '@app/common/transformer'
import { UseStore } from '@app/core/store'
import { Body, Controller, Get, Patch } from '@nestjs/common'
import { updateUserPasswordSchema, updateUserSchema } from 'schemas'
import { ResponseUserDto } from './dto'
import { UserStore } from './store'
import { UserService } from './user.service'

@TransformerOptions({ instance: ResponseUserDto })
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async me(@UseStore(UserStore) user: User) {
    return user
  }

  @Patch()
  async update(
    @UseStore(UserStore) user: User,
    @Body(new ValidationPipe(updateUserSchema)) updateUser: UpdateUser,
  ) {
    return this.userService.update(user, updateUser)
  }

  @Patch('password')
  async updatePassword(
    @UseStore(UserStore) user: User,
    @Body(new ValidationPipe(updateUserPasswordSchema)) updateUserPassword: UpdateUserPassword,
  ) {
    return this.userService.updatePassword(user, updateUserPassword)
  }
}
