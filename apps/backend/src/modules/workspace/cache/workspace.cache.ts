import type { Cache } from 'cache-manager'
import { Workspace } from '@generated/prisma'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class WorkspaceCache {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  key(uuid: string) {
    return `workspace:${uuid}`
  }

  async get(uuid: string) {
    return this.cacheManager.get<Workspace>(this.key(uuid))
  }

  async set(workspace: Workspace) {
    return this.cacheManager.set(this.key(workspace.uuid), workspace)
  }

  async del(uuid: string) {
    return this.cacheManager.del(this.key(uuid))
  }
}
