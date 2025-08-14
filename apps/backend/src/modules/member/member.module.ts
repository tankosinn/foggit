import { Module } from '@nestjs/common'
import { MemberCache } from './cache'
import { MemberController } from './member.controller'
import { MemberService } from './member.service'

@Module({
  controllers: [MemberController],
  providers: [MemberService, MemberCache],
  exports: [MemberService, MemberCache],
})
export class MemberModule {}
