<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef, type Ref, type ShallowRef } from 'vue';
import { TABLE_BODY_ELEMENT_ID_SELECTOR, TABLE_WRAPPER_ELEMENT_ID_SELECTOR, TABLE_HEADER_ROW_ELEMENT_ID_SELECTOR } from '../_constants';
import type { TableFilterLayoutPropsInterface } from '../_models';
import useClickOutside from '../composables/useClickOutside';
const props = defineProps<TableFilterLayoutPropsInterface>()
const filterToggleButtonRef: Readonly<ShallowRef<HTMLElement | null>> = useTemplateRef('filterToggleButtonRef')
const filterModalRef: Readonly<ShallowRef<HTMLElement | null>> = useTemplateRef('filterModalRef')
const filterPanelVisibility: Ref<boolean> = ref(false)
const filterPanelCoordinates: Ref<{ x: number; y: number }> = ref({ x: 0, y: 0 })
const filterPanelDimensions: Ref<{ width: number; height: number | 'auto' }> = ref({
  width: 192,
  height: 'auto',
})
const isComponentMounted: Ref<boolean> = ref(false)
const lastScrollTop: Ref<number> = ref(0)
const lastScrollLeft: Ref<number> = ref(0)

const setModalPosition = () => {
  const gapBetweenTableAndModal = 4;
  const gapBetweenFilterButtonAndModal = 4;
  const tableBorderWidth = 1
  const buttonRect = filterToggleButtonRef.value!.getBoundingClientRect()
  let x = 0;
  const tableWidth = props.modalXAxisBoundaries.to - props.modalXAxisBoundaries.from;
  if (filterPanelDimensions.value.width + (gapBetweenTableAndModal * 2) + (tableBorderWidth * 2) >= tableWidth) {
    x = props.modalXAxisBoundaries.from + gapBetweenTableAndModal + tableBorderWidth
    filterPanelDimensions.value.width = tableWidth - (gapBetweenTableAndModal * 2) - (tableBorderWidth * 2)
  } else {
    x = buttonRect.x + buttonRect.width - filterPanelDimensions.value.width
    if (x - tableBorderWidth - gapBetweenTableAndModal < props.modalXAxisBoundaries.from) {
      x = props.modalXAxisBoundaries.from + tableBorderWidth + gapBetweenTableAndModal
    }

  }

  filterPanelCoordinates.value = {
    x,
    y: buttonRect.y + buttonRect.height + gapBetweenFilterButtonAndModal,
  }
}
useClickOutside(
  filterModalRef as ShallowRef<HTMLElement>,
  () => (filterPanelVisibility.value = false),
  filterToggleButtonRef as ShallowRef<HTMLElement>
)
const onFilterButtonClick = () => {
  if (filterPanelVisibility.value) {
    filterPanelVisibility.value = false
  } else {
    setModalPosition()
    filterPanelVisibility.value = true
  }
}

const windowScrollHandler = (e: Event): void => {
  if ((e.target as HTMLElement).id === TABLE_BODY_ELEMENT_ID_SELECTOR || (e.target as HTMLElement).id === TABLE_HEADER_ROW_ELEMENT_ID_SELECTOR) {
    let currentScrollTop = (e.target as HTMLElement).scrollTop;
    let currentScrollLeft = (e.target as HTMLElement).scrollLeft;

    // if (currentScrollTop > lastScrollTop.value) {
    //   // downward
    // } else if (currentScrollTop < lastScrollTop.value) {
    //   // upward
    // }

    if (currentScrollLeft > lastScrollLeft.value) {
      // to the right
      filterPanelVisibility.value = false
    } else if (currentScrollLeft < lastScrollLeft.value) {
      // to the left
      filterPanelVisibility.value = false
    }
    lastScrollTop.value = currentScrollTop;
    lastScrollLeft.value = currentScrollLeft;
  } else {
    filterPanelVisibility.value = false
  }

}
onMounted(() => {
  isComponentMounted.value = true;
  window.addEventListener('scroll', windowScrollHandler, true)
})
onUnmounted(() => {
  window.removeEventListener('scroll', windowScrollHandler, true)
})

</script>

<template>
  <main class="ht-header-filter-wrapper">
    <button ref="filterToggleButtonRef" :class="{ '-is-active': props.isActive, '-is-open': filterPanelVisibility }"
      class="ht-button ht-header-filter-icon-button" @click="onFilterButtonClick()">
      <span class="ht-header-filter-icon" v-html="props.icons.filter"></span>
    </button>
  </main>
  <Teleport :to="'#' + TABLE_WRAPPER_ELEMENT_ID_SELECTOR" v-if="filterPanelVisibility" :disabled="!isComponentMounted">
    <div ref="filterModalRef" class="ht-header-filter-modal" :style="{
      top: filterPanelCoordinates.y + 'px',
      left: filterPanelCoordinates.x + 'px',
      width: filterPanelDimensions.width + 'px',
      height: typeof filterPanelDimensions.height === 'number' ? filterPanelDimensions.height + 'px' : filterPanelDimensions.height
    }">
      <slot name="filterComponent"></slot>
    </div>
  </Teleport>
</template>

<style scoped>
.ht-header-filter-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ht-header-column-filter-button-width);
  height: var(--ht-header-column-filter-button-height);
  border-radius: 4px;

  &.-is-active {
    position: relative;
  }

  &.-is-active::after {
    content: '';
    position: absolute;
    top: 1px;
    right: 1px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: 2px solid var(--ht-header-bg-color);
    background-color: var(--ht-accent-color);
  }

  &.-is-active:hover::after,
  &.-is-active.-is-open::after {
    border-color: var(--ht-header-column-filter-button-hover-bg-color);
  }

  &:hover {
    background-color: var(--ht-header-column-filter-button-hover-bg-color);
  }

  &.-is-open {
    background-color: var(--ht-header-column-filter-open-modal-button-bg-color);
  }


}

.ht-header-filter-icon {
  width: var(--ht-header-column-filter-icon-width);
  height: var(--ht-header-column-filter-icon-height);
  pointer-events: none;

  :deep(> *) {
    font-size: inherit;
    color: currentColor;
  }

  :deep(> svg) {
    width: 100%;
    height: 100%;
  }
}

.ht-header-filter-modal {
  position: fixed;
  padding: var(--ht-header-column-filter-modal-padding);
  background-color: var(--ht-header-column-filter-modal-bg-color);
  box-shadow: var(--ht-header-column-filter-modal-shadow);
  border: 1px solid var(--ht-header-column-filter-modal-border-color);
  border-radius: 6px;
  box-sizing: border-box;
  z-index: 1;
}
</style>
