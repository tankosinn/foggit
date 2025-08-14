import { Module } from '@nestjs/common'
import { UserCache } from './cache/user.cache'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  controllers: [UserController],
  providers: [UserService, UserCache],
  exports: [UserService, UserCache],
})
export class UserModule {}
