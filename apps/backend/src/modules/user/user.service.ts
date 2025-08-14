import { UserPayload } from '@app/core/auth'
import { PrismaService } from '@app/core/database'
import { User } from '@generated/prisma'
import { BadRequestException, Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { UpdateUser, UpdateUserPassword } from 'schemas'
import { UserCache } from './cache'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userCache: UserCache,
  ) {}

  async me(userPayload: UserPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        uuid: userPayload.sub,
      },
    })

    if (user) {
      await this.userCache.set(user)
    }

    return user
  }

  async update(user: User, updateUser: UpdateUser) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateUser,
    })

    await this.userCache.del(updatedUser.uuid)

    return updatedUser
  }

  async updatePassword(user: User, updateUserPassword: UpdateUserPassword) {
    if (updateUserPassword.type === 'RESET' || updateUserPassword.type === 'REMOVE') {
      if (user.password === null) {
        throw new BadRequestException('User does not have a password')
      }

      const isPasswordValid = await bcrypt.compare(updateUserPassword.currentPassword, user.password)
      if (!isPasswordValid) {
        throw new BadRequestException('Current password is incorrect')
      }

      if (updateUserPassword.type === 'REMOVE') {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { password: null },
        })
        await this.userCache.del(user.uuid)
        return
      }
    }

    if (updateUserPassword.type === 'SET' && user.password != null) {
      throw new BadRequestException('User already has a password')
    }

    const hashedPassword = await bcrypt.hash(updateUserPassword.newPassword, 10)
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })
    await this.userCache.del(user.uuid)
  }
}
