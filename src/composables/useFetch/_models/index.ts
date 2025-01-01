import type { maybeNull } from '@/_core'
import type { Ref } from 'vue'
export type UrlType = string | Ref<string> | (() => string)
export interface UseFetchOptionInterface {
  immediate?: boolean
}
export interface UseFetchResInterface<T> {
  data: Ref<maybeNull<T>>
  error: Ref<unknown>
  isFetching: Ref<boolean>
  execute: () => void
}
