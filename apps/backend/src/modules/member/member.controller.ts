import type { UpdateMember } from 'schemas'
import { ValidationPipe } from '@app/common/pipes'
import { TransformerOptions } from '@app/common/transformer'
import { Action } from '@app/core/casl/constants'
import { CheckPolicies } from '@app/core/casl/decorators'
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common'
import { updateMemberSchema } from 'schemas'
import { ResponseMemberDto } from './dto/response-member.dto'
import { MemberService } from './member.service'

@TransformerOptions({ instance: ResponseMemberDto })
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async findAll() {
    return this.memberService.findAll()
  }

  @Get(':uuid')
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.memberService.findOne(uuid)
  }

  @Patch(':uuid')
  @CheckPolicies([Action.Update, 'WorkspaceMember'])
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body(new ValidationPipe(updateMemberSchema)) updateMember: UpdateMember,
  ) {
    return this.memberService.update(uuid, updateMember)
  }

  @Delete(':uuid')
  @CheckPolicies([Action.Delete, 'WorkspaceMember'])
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.memberService.remove(uuid)
  }
}
