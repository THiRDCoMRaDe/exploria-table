import { onMounted, type ShallowRef } from 'vue'

export default function useClickOutside(
  component: ShallowRef<HTMLElement>,
  callback: () => void,
  excludeComponent?: ShallowRef<HTMLElement>,
) {
  if (!component) {
    throw new Error('A target component has to be provided.')
  }

  if (!callback) {
    throw new Error('A callback has to be provided.')
  }

  const listener = (event: Event) => {
    if (event.target === component.value || event.composedPath().includes(component.value)) {
      return
    }
    if (
      excludeComponent &&
      (event.target === excludeComponent.value ||
        event.composedPath().includes(excludeComponent.value))
    ) {
      return
    }

    if (typeof callback === 'function') {
      callback()
    }
  }

  onMounted(() => {
    window.addEventListener('click', listener)
  })
}
