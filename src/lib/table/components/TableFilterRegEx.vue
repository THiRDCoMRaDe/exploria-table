<script setup lang="ts">
import type { TableFilterRegExEmitsInterface, TableFilterRegExPropsInterface } from '../_models';


const props = defineProps<TableFilterRegExPropsInterface>()
const emit = defineEmits<TableFilterRegExEmitsInterface>()
const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emit('filterChange', { filterTerm: !!value ? value : null })
}
</script>

<template>
  <main class="ht-header-filter-regEx-container">
    <input placeholder="RegEx Filter... (//)"
      class="ht-input ht-filter-input-text ht-header-filter-regEx-filter-term-input" type="text"
      :value="props.activeFilter.term" @input="onInput($event)">
  </main>
</template>

<style scoped>
.ht-header-filter-regEx-container {
  display: flex;
}

.ht-header-filter-regEx-filter-term-input {
  display: flex;
  width: 100%;
}
</style>
