import type { Type } from '@nestjs/common'
import type { IStore } from '../types'
import { createParamDecorator } from '@nestjs/common'
import { ClsServiceManager } from 'nestjs-cls'

export const UseStore = createParamDecorator(
  async (storeClass: Type<IStore>) => {
    const cls = ClsServiceManager.getClsService()
    return cls.proxy.get(storeClass).use()
  },
)
