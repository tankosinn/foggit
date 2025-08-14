import type { Request } from 'express'
import { PrismaService } from '@app/core/database'
import { IStore, Store } from '@app/core/store'
import { MemberStore } from '@app/modules/member'
import { Workspace } from '@generated/prisma'
import { Inject, NotFoundException } from '@nestjs/common'
import { CLS_REQ } from 'nestjs-cls'
import { WorkspaceCache } from '../cache'

@Store()
export class WorkspaceStore implements IStore {
  private workspace: Workspace | undefined = undefined

  constructor(
    @Inject(CLS_REQ) private readonly req: Request,
    private readonly memberStore: MemberStore,
    private readonly workspaceCache: WorkspaceCache,
    private readonly prisma: PrismaService,
  ) {}

  async use() {
    if (this.workspace !== undefined) {
      return this.workspace
    }

    const member = await this.memberStore.use()

    const cachedWorkspace = await this.workspaceCache.get(this.req.cookies.workspace!)
    if (cachedWorkspace !== undefined) {
      this.workspace = cachedWorkspace
      return this.workspace
    }

    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: member.workspaceId,
      },
    })

    if (workspace === null) {
      throw new NotFoundException('Workspace not found')
    }

    await this.workspaceCache.set(workspace)

    this.workspace = workspace
    return this.workspace
  }
}
