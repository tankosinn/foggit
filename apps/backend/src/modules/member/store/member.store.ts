import type { WorkspaceMember } from '@generated/prisma'
import type { Request } from 'express'
import { PrismaService } from '@app/core/database'
import { IStore, Store } from '@app/core/store'
import { UserStore } from '@app/modules/user/store'
import { BadRequestException, ForbiddenException, Inject } from '@nestjs/common'
import { CLS_REQ } from 'nestjs-cls'
import { MemberCache } from '../cache'

@Store()
export class MemberStore implements IStore {
  private member: WorkspaceMember | undefined = undefined

  constructor(
    @Inject(CLS_REQ) private readonly req: Request,
    private readonly prisma: PrismaService,
    private readonly userStore: UserStore,
    private readonly memberCache: MemberCache,
  ) {}

  async use() {
    if (this.member !== undefined) {
      return this.member
    }

    const workspaceUUID = this.req.cookies.workspace
    if (workspaceUUID == null) {
      throw new BadRequestException('Workspace required')
    }

    const user = await this.userStore.use()

    const cachedMember = await this.memberCache.get(workspaceUUID, user.uuid)
    if (cachedMember) {
      this.member = cachedMember
      return this.member
    }

    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        workspace: { uuid: workspaceUUID },
        userId: user.id,
      },
    })

    if (!member) {
      throw new ForbiddenException('You are not a member of this workspace')
    }

    await this.memberCache.set(workspaceUUID, user.uuid, member)

    this.member = member

    return this.member
  }
}
