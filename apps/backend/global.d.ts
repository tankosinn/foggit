import type { UserPayload } from '@app/core/auth'
import type { AppAbility } from '@app/core/casl/casl-ability.factory'
import type { EnvironmentSchema } from '@app/core/config'
import type { StoreReturnType } from '@app/core/store'

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentSchema {}
  }
}

declare module 'express' {
  interface Request {
    cookies: Record<string, string | undefined>
    stores: Record<string, (() => StoreReturnType) | undefined>
    user?: UserPayload
    ability?: AppAbility
  }
}

export {}
