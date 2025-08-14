import type { Observable } from 'rxjs'

export type StoreReturnType<T = unknown> = T | Promise<T> | Observable<T>

export interface IStore<T = unknown> {
  use: () => StoreReturnType<T>
}
