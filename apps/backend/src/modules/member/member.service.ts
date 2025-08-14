import type { Request } from 'express'
import type { UpdateMember } from 'schemas'
import { CaslAbilityStore } from '@app/core/casl'
import { accessibleBy } from '@app/core/casl/casl-prisma.integration'
import { PrismaService } from '@app/core/database'
import { Inject, Injectable } from '@nestjs/common'
import { CLS_REQ } from 'nestjs-cls'
import { MemberCache } from './cache'

@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly abilityStore: CaslAbilityStore,
    private readonly memberCache: MemberCache,
    @Inject(CLS_REQ) private readonly req: Request,
  ) {}

  async findAll() {
    const ability = await this.abilityStore.use()
    return this.prisma.workspaceMember.findMany({
      include: { user: true },
      where: accessibleBy(ability).WorkspaceMember,
    })
  }

  async findOne(uuid: string) {
    const ability = await this.abilityStore.use()
    return this.prisma.workspaceMember.findUnique({
      where: {
        uuid,
        AND: accessibleBy(ability).WorkspaceMember.AND,
      },
      include: { user: true },
    })
  }

  async update(uuid: string, updateMember: UpdateMember) {
    const ability = await this.abilityStore.use()
    const member = await this.prisma.workspaceMember.update({
      where: {
        uuid,
        AND: accessibleBy(ability).WorkspaceMember.AND,
      },
      data: updateMember,
      include: { user: true },
    })

    await this.memberCache.del(this.req.cookies.workspace!, member.user.uuid)
    return member
  }

  async remove(uuid: string) {
    const ability = await this.abilityStore.use()
    const member = await this.prisma.workspaceMember.delete({
      where: {
        uuid,
        AND: accessibleBy(ability).WorkspaceMember.AND,
      },
      include: { user: true },
    })

    await this.memberCache.del(this.req.cookies.workspace!, member.user.uuid)
    return member
  }
}
