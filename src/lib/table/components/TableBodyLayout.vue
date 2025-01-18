<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch, type Ref, type ShallowRef } from 'vue';
import type { TableBodyLayoutProps, TableBodyLayoutEmitsInterface } from '../_models';
import { asap, getScrollBarWidth } from '../_helpers';
import { TABLE_BODY_ELEMENT_ID_SELECTOR } from '../_constants'
const props = defineProps<TableBodyLayoutProps>()
const emit = defineEmits<TableBodyLayoutEmitsInterface>()
const browserScrollWidth: Ref<number> = ref(0)
const totalWidth: Ref<number> = ref(0)
const filterToggleButtonRef: Readonly<ShallowRef<HTMLElement | null>> = useTemplateRef('bodyLayoutElementRef')
const onscroll = (e: Event) => {
  const { scrollTop, scrollLeft } = (e.target as HTMLElement)
  emit('scrollChange', { top: scrollTop, left: scrollLeft })
  totalWidth.value = filterToggleButtonRef.value!.scrollWidth > filterToggleButtonRef.value!.clientWidth ? props.colsTotalWidth : props.colsTotalWidth - browserScrollWidth.value
}
watch(
  [() => props.totalRowsCount, () => props.colsTotalWidth],
  () => {
    asap(() => {
      totalWidth.value =
        filterToggleButtonRef.value
          ? filterToggleButtonRef.value.scrollHeight > filterToggleButtonRef.value.clientHeight
            ? props.colsTotalWidth - browserScrollWidth.value
            : props.colsTotalWidth
          : props.colsTotalWidth
    })

  },
  { immediate: true },
)
onMounted(() => {
  browserScrollWidth.value = getScrollBarWidth()
})
</script>


<template>
  <main class="ht-body-layout" :id="TABLE_BODY_ELEMENT_ID_SELECTOR" @scroll="onscroll($event)"
    ref="bodyLayoutElementRef">
    <div :style="{ minWidth: `${totalWidth}px` }">
      <slot name="rows"></slot>
      <slot name="overlay"></slot>
    </div>
  </main>
</template>

<style scoped>
main.ht-body-layout {
  display: flex;
  flex-direction: column;
  overflow: auto;
  max-width: 100%;

  div {
    max-width: 100%;
  }
}
</style>
