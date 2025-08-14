import type { Cache } from 'cache-manager'
import { WorkspaceMember } from '@generated/prisma'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class MemberCache {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  key(workspaceUUID: string, userUUID: string) {
    return `member:${workspaceUUID}:${userUUID}`
  }

  async get(workspaceUUID: string, userUUID: string) {
    return this.cacheManager.get<WorkspaceMember>(this.key(workspaceUUID, userUUID))
  }

  async set(workspaceUUID: string, userUUID: string, workspaceMember: WorkspaceMember) {
    return this.cacheManager.set(this.key(workspaceUUID, userUUID), workspaceMember)
  }

  async del(workspaceUUID: string, userUUID: string) {
    return this.cacheManager.del(this.key(workspaceUUID, userUUID))
  }
}
