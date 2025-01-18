import { ref, toRef, toValue, watch } from 'vue'
import type { Ref } from 'vue'
import type { UrlType, UseFetchOptionInterface, UseFetchResInterface } from './_models'
import type { maybeNull } from '@/_core'

export function useFetch<T>(
  url: UrlType,
  option: UseFetchOptionInterface,
): UseFetchResInterface<T> {
  const data: Ref<maybeNull<T>> = ref(null)
  const error: Ref<unknown> = ref(null)
  const isFetching: Ref<boolean> = ref(false)

  const defaultOption: Required<UseFetchOptionInterface> = {
    immediate: true,
  }

  const _option: UseFetchOptionInterface = {
    ...defaultOption,
    ...option,
  }
  const init = () => {
    if (_option.immediate) {
      fetchData()
    }
  }
  const execute = () => {
    fetchData()
  }
  const fetchData = () => {
    data.value = null
    error.value = null
    isFetching.value = true
    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
      .finally(() => (isFetching.value = false))
  }

  watch(toRef(url), () => init(), { immediate: true })
  return { data, error, isFetching, execute }
}
