<script setup lang="ts">
import { computed, toValue, type ComputedRef } from 'vue';
import Multiselect from 'vue-multiselect';
import type { TableColTextFilterOption, TableFilterTextEmitsInterface, TableFilterTextPropsInterface, TableFilterTextSelectOptionInterface } from '../_models';

const props = defineProps<TableFilterTextPropsInterface>()
const emit = defineEmits<TableFilterTextEmitsInterface>()


const getOptionLabel = (optionValue: TableColTextFilterOption): string => {
  let label: string = ''
  switch (optionValue) {
    case 'contains':
      label = "Contains"
      break;
    case 'equals':
      label = "Equals"
      break;
    case 'startsWith':
      label = "Starts with"
      break;
    case 'endsWith':
      label = "Ends with"
      break;

  }
  return label
}
const filterTextOptions: ComputedRef<TableFilterTextSelectOptionInterface[]> = computed(() => {
  const filterOptionsValue = toValue(props.filterConfig.filterOptions)
  return filterOptionsValue!.map((v) => ({ label: getOptionLabel(v), value: v }))
})
const selectedFilterOption: ComputedRef<TableFilterTextSelectOptionInterface> = computed(() => {
  const selectedFilterOptionValue = toValue(props.activeFilter.selectedFilterOption)
  let selectedItemIndex: number = filterTextOptions.value.findIndex(
    (item) => item.value === selectedFilterOptionValue,
  )
  selectedItemIndex = selectedItemIndex !== -1 ? selectedItemIndex : 0
  return filterTextOptions.value[selectedItemIndex]
})
const onFilterOptionChange = (selectedFilter: TableFilterTextSelectOptionInterface) => {
  emit('filterChange', { filterTerm: props.activeFilter.term!, selectedFilterOption: selectedFilter.value })
}
const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emit('filterChange', { filterTerm: !!value ? value : null, selectedFilterOption: props.activeFilter.selectedFilterOption! })
}
</script>

<template>
  <main class="ht-header-filter-text-container">
    <div class="ht-filter-input-select">
      <multiselect :model-value="selectedFilterOption" track-by="label" label="label" placeholder=""
        :options="filterTextOptions" :searchable="false" :allow-empty="false" :select-label="''" :selected-label="''"
        :deselect-label="''" :disabled="filterTextOptions.length === 1" @select="onFilterOptionChange">
        <template v-slot:singleLabel="{ option }">
          <span>{{ option.label }}</span>
        </template>
      </multiselect>
    </div>
    <input placeholder="Filter..." class="ht-input ht-filter-input-text ht-header-filter-text-filter-term-input"
      type="text" :value="props.activeFilter.term" @input="onInput($event)">
  </main>
</template>

<style scoped>
.ht-header-filter-text-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ht-header-filter-text-filter-term-input {
  display: flex;
  width: auto;
}
</style>
