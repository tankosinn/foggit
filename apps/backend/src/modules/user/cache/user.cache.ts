import type { Cache } from 'cache-manager'
import { User } from '@generated/prisma'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class UserCache {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  key(uuid: string) {
    return `user:${uuid}`
  }

  async get(uuid: string) {
    return this.cacheManager.get<User>(this.key(uuid))
  }

  async set(user: User) {
    return this.cacheManager.set(this.key(user.uuid), user)
  }

  async del(uuid: string) {
    return this.cacheManager.del(this.key(uuid))
  }
}
