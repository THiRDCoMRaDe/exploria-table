<script setup lang="ts">
import { computed, toValue, type ComputedRef } from 'vue'
import Multiselect from 'vue-multiselect'
import type {
  PaginationPageChangeEmitActionType,
  TablePaginationEmitsInterface,
  TablePaginationPropsInterface,
  TablePaginationSelectItemInterface,
} from '../_models'
const props = defineProps<TablePaginationPropsInterface>()

const emit = defineEmits<TablePaginationEmitsInterface>()

const paginationSizeView: ComputedRef<'none' | 'select' | 'label'> = computed(() => {
  const pageSizeSelectorValue = toValue(props.pageSizeSelector)
  if (typeof pageSizeSelectorValue === 'boolean' && !pageSizeSelectorValue) {
    return 'none'
  } else if (Array.isArray(pageSizeSelectorValue)) {
    if (!pageSizeSelectorValue.length) {
      return 'none'
    } else {
      if (pageSizeSelectorValue.length > 1) {
        return 'select'
      } else {
        return 'label'
      }
    }
  } else {
    return 'select'
  }
})

const paginationSizeOptions: ComputedRef<TablePaginationSelectItemInterface[]> = computed(() => {
  const pageSizeSelectorValue = toValue(props.pageSizeSelector)
  return Array.isArray(pageSizeSelectorValue)
    ? pageSizeSelectorValue.map((v) => ({ label: v.toString(), value: v }))
    : []
})

const selectedPaginationSize: ComputedRef<TablePaginationSelectItemInterface> = computed(() => {
  const activePageSizeValue = toValue(props.activePageSize)
  let selectedItemIndex: number = paginationSizeOptions.value.findIndex(
    (item) => item.value === activePageSizeValue,
  )
  selectedItemIndex = selectedItemIndex !== -1 ? selectedItemIndex : 0
  return paginationSizeOptions.value[selectedItemIndex]
})

const onPaginationChange = (option: TablePaginationSelectItemInterface) => {
  emit('paginationSizeChange', option.value)
}
const setPage = (action: PaginationPageChangeEmitActionType) => {
  let pageNumber: number = props.activePageNumber
  switch (action) {
    case 'first':
      pageNumber = 1
      break
    case 'prev':
      pageNumber = props.activePageNumber - 1
      break
    case 'next':
      pageNumber = props.activePageNumber + 1
      break
    case 'last':
      pageNumber = props.totalPageCount
      break
  }
  emit('paginationPageChange', pageNumber)
}
</script>
<template>
  <main class="ht-pagination">
    <div class="ht-pagination-size-container">
      <template v-if="paginationSizeView !== 'none'">
        <label class="ht-pagination-size-label">Page Size:</label>
        <div class="ht-pagination-size-select ht-pagination-input-select" v-if="paginationSizeView === 'select'">
          <multiselect :model-value="selectedPaginationSize" track-by="label" label="label" placeholder=""
            :options="paginationSizeOptions" :searchable="false" :allow-empty="false" :select-label="''"
            :selected-label="''" :deselect-label="''" @select="onPaginationChange" :open-direction="'above'">
            <template v-slot:singleLabel="{ option }">
              <span>{{ option.label }}</span>
            </template>
          </multiselect>
        </div>
        <div class="ht-pagination-size-value -is-label" v-if="paginationSizeView === 'label'">
          {{ props.activePageSize }}
        </div>
      </template>
    </div>
    <div class="ht-pagination-summary-container">
      <span class="ht-pagination-summary-value">{{ props.activePageSummaryData.start }}</span>
      <label class="ht-pagination-summary-label">to</label>
      <span class="ht-pagination-summary-value">{{ props.activePageSummaryData.end }}</span>
      <label class="ht-pagination-summary-label">of</label>
      <span class="ht-pagination-summary-value">{{ props.activePageSummaryData.total }}</span>
    </div>
    <div class="ht-pagination-panel">
      <button class="ht-button ht-pagination-panel-button" :disabled="props.activePageNumber === 1"
        @click="setPage('first')" v-html="props.icons.first"></button>
      <button class="ht-button ht-pagination-panel-button" :disabled="props.activePageNumber === 1"
        @click="setPage('prev')" v-html="props.icons.previous"></button>
      <label class=" ht-pagination-panel-label">Page</label>
      <span class=" ht-pagination-panel-value">{{ props.activePageNumber }}</span>
      <label class=" ht-pagination-panel-label">of</label>
      <span class=" ht-pagination-panel-value">{{ totalPageCount }}</span>
      <button class="ht-button ht-pagination-panel-button" :disabled="props.activePageNumber === props.totalPageCount"
        @click="setPage('next')" v-html="props.icons.next">
      </button>
      <button class="ht-button ht-pagination-panel-button" :disabled="props.activePageNumber === props.totalPageCount"
        @click="setPage('last')" v-html="props.icons.last">
      </button>
    </div>
  </main>
</template>
<style>
main.ht-pagination {
  display: flex;
  align-items: center;
  column-gap: 12px;
  height: 100%;
  font-family: var(--ht-pagination-font-family);
  font-size: var(--ht-pagination-font-size);
  font-size: var(--ht-pagination-font-weight);
  color: var(--ht-pagination-text-color);
}

.ht-pagination-size-container {
  display: flex;
  align-items: center;
  column-gap: 4px;
}

.ht-pagination-size-label {
  font-weight: var(--ht-pagination-label-font-weight);
}

.ht-pagination-summary-container {
  display: flex;
  align-items: center;
  column-gap: 4px;
}

.ht-pagination-summary-label {
  font-weight: var(--ht-pagination-label-font-weight);
}

.ht-pagination-panel {
  display: flex;
  align-items: center;
  column-gap: 4px;
}

.ht-pagination-panel-label {
  font-weight: var(--ht-pagination-label-font-weight);
}

.ht-pagination-panel-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ht-pagination-panel-button-width);
  height: var(--ht-pagination-panel-button-height);
  color: var(--ht-pagination-panel-button-color);

  >svg {
    width: 100%;
    height: 100%;
  }

  &:disabled,
  &[disabled] {
    cursor: not-allowed;
    color: var(--ht-pagination-panel-button-disabled-color)
  }
}
</style>
