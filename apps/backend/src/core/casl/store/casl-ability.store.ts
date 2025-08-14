import type { Request } from 'express'
import { IStore, Store } from '@app/core/store'
import { MemberStore } from '@app/modules/member/store'
import { Inject } from '@nestjs/common'
import { CLS_REQ } from 'nestjs-cls'
import { CaslAbilityFactory } from '../casl-ability.factory'

@Store()
export class CaslAbilityStore implements IStore {
  constructor(
    @Inject(CLS_REQ) private readonly req: Request,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly memberStore: MemberStore,
  ) {}

  async use() {
    if (this.req.ability !== undefined) {
      return this.req.ability
    }

    const member = await this.memberStore.use()

    this.req.ability = this.caslAbilityFactory.createForMember(member)
    return this.req.ability
  }
}
