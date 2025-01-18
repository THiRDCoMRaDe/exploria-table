<script setup lang="ts">
import type { maybeNull } from '@/_core'
import { computed, onMounted, onUnmounted, ref, toRef, useTemplateRef, watch, type ComputedRef, type Ref, type ShallowRef } from 'vue'
import { hasValue } from '../_helpers'
import type {
  TableHeaderColSortChangeEventHeldDownKeyboardKeyType,
  TableHeaderEmitsInterface,
  TableHeaderPropsInterface,
} from '../_models'
import { TABLE_HEADER_ROW_ELEMENT_ID_SELECTOR } from '../_constants';
const props = defineProps<TableHeaderPropsInterface>()

const emit = defineEmits<TableHeaderEmitsInterface>()

const heldDownKeyboardKey: Ref<maybeNull<TableHeaderColSortChangeEventHeldDownKeyboardKeyType>> =
  ref(null)
const colIdOfFocusedResizeHandler: Ref<maybeNull<string>> = ref(null)
const currentWidthOfFocusedResizeHandler: Ref<maybeNull<number>> = ref(null)
const mousePointerXPositionOnResizeStart: Ref<maybeNull<number>> = ref(null)
const headerRowRef: Readonly<ShallowRef<HTMLElement | null>> = useTemplateRef('headerRowRef')
const maxSortIndex: ComputedRef<number> = computed(() => {
  return Math.max(
    ...Object.values(props.colsSortData).map((col) =>
      col.sortIndex !== null ? col.sortIndex : -1,
    ),
  )
})

const onColClick = (e: Event, colId: string, isSortable: boolean) => {
  if (isSortable && !(e.target as HTMLElement)!.classList.contains('ht-header-filter-icon-button')) {
    emit('columnSortChange', { colId, heldDownKeyboardKey: heldDownKeyboardKey.value })
  }
}
const windowKeyDownHandler = (e: KeyboardEvent): void => {
  const value: maybeNull<TableHeaderColSortChangeEventHeldDownKeyboardKeyType> = e.altKey
    ? 'alt'
    : e.ctrlKey
      ? 'ctrl'
      : e.shiftKey
        ? 'shift'
        : null
  heldDownKeyboardKey.value = value
}
const windowKeyUpHandler = (e: KeyboardEvent): void => {
  heldDownKeyboardKey.value = null
}
const windowMouseUpHandler = (e: MouseEvent) => {
  mousePointerXPositionOnResizeStart.value = null
  colIdOfFocusedResizeHandler.value = null
  currentWidthOfFocusedResizeHandler.value = null
  window.removeEventListener('mousemove', windowMouseMoveHandler)
}
const windowMouseMoveHandler = (e: MouseEvent) => {
  if (colIdOfFocusedResizeHandler.value && hasValue(mousePointerXPositionOnResizeStart.value)) {
    const calculatedColWidth =
      (currentWidthOfFocusedResizeHandler.value as number) +
      e.x -
      (mousePointerXPositionOnResizeStart.value as number)
    emit('columnWidthChange', {
      colId: colIdOfFocusedResizeHandler.value,
      width: calculatedColWidth,
    })
  }
}
const onResizeHandlerMouseDown = (e: MouseEvent, colId: string) => {
  mousePointerXPositionOnResizeStart.value = e.x
  colIdOfFocusedResizeHandler.value = colId
  currentWidthOfFocusedResizeHandler.value = props.colsWidthData[colId].actualWidth
  window.addEventListener('mousemove', windowMouseMoveHandler)
}

watch(
  () => props.scrollLeft,
  () => {
    headerRowRef.value?.scrollTo(props.scrollLeft, 0)
  },
  { immediate: true },
)
onMounted(() => {
  window.addEventListener('keydown', windowKeyDownHandler)
  window.addEventListener('keyup', windowKeyUpHandler)
  window.addEventListener('mouseup', windowMouseUpHandler)
})
onUnmounted(() => {
  window.removeEventListener('keydown', windowKeyDownHandler)
  window.removeEventListener('keyup', windowKeyUpHandler)
  window.removeEventListener('mouseup', windowMouseUpHandler)
  window.removeEventListener('mousemove', windowMouseMoveHandler)
})
</script>

<template>
  <div class="ht-header-row" :style="{ minHeight: `${props.headerHeight}px` }" ref="headerRowRef"
    :id="TABLE_HEADER_ROW_ELEMENT_ID_SELECTOR">
    <div class="ht-header-cell" :style="{
      minWidth: `${props.colsWidthData[col.colId].actualWidth}px`,
      width: `${props.colsWidthData[col.colId].actualWidth}px`,
    }" v-for="col in props.colsBaseData" :key="col.colId">
      <div class="ht-header-col-wrapper" @click="onColClick($event, col.colId, props.colsSortData[col.colId].sortable)"
        :style="{ cursor: props.colsSortData[col.colId].sortable ? 'pointer' : 'default' }">
        <span class="ht-header-col-label">{{ col.headerName }}</span>
        <span class="ht-header-col-sort-index" v-if="maxSortIndex > 1">
          {{ props.colsSortData[col.colId].sortIndex }}
        </span>
        <span class="ht-header-col-sort" v-if="props.colsSortData[col.colId].sort !== null" v-html="props.colsSortData[col.colId].sort === 'asc'
          ? props.icons.sortAscending
          : props.icons.sortDescending
          "></span>
        <div class="ht-header-col-filter-wrapper">
          <slot :name="'filter-' + col.colId"></slot>
        </div>
      </div>
      <span class="ht-header-cell-resize" v-if="col.resizable"
        @mousedown.stop="onResizeHandlerMouseDown($event, col.colId)"></span>
    </div>
  </div>
</template>

<style scoped>
.ht-header-row {
  display: flex;
  align-items: center;
  width: 100%;
  font-family: var(--ht-header-font-family);
  font-size: var(--ht-header-font-size);
  font-weight: var(--ht-header-font-weight);
  color: var(--ht-header-text-color);
  background-color: var(--ht-header-bg-color);
  border-bottom: 1px solid var(--ht-header-border-color);
  list-style: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  overflow: hidden;
  box-sizing: border-box;
}

.ht-header-cell {
  position: relative;
  display: flex;
  justify-content: flex-start;
  height: 100%;
  padding: 0 var(--ht-header-cell-horizontal-padding);
  box-sizing: border-box;
}

.ht-header-col-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
}

.ht-header-col-label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ht-header-col-sort-index {
  padding-inline-start: var(--ht-spacing);
}

.ht-header-col-sort {
  width: var(--ht-header-column-sort-icon-width);
  height: var(--ht-header-column-sort-icon-height);
  padding-inline-start: var(--ht-spacing);

  :deep(> *) {
    font-size: inherit;
    color: currentColor;
  }

  :deep(> svg) {
    width: 100%;
    height: 100%;
  }
}

.ht-header-cell-resize {
  position: absolute;
  right: -4px;
  display: flex;
  width: 8px;
  height: 100%;
  margin-left: auto;
  cursor: e-resize;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--ht-header-column-resize-handle-width);
    height: var(--ht-header-column-resize-handle-height);
    background-color: var(--ht-header-column-resize-handle-color);
    transform: translate(-50%, -50%);
  }
}

.ht-header-col-filter-wrapper {
  display: flex;
  margin-left: auto;
}
</style>
