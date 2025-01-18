<script setup lang="ts" generic="T">
import type { TableBodyRowsProps } from '../_models';

const props = defineProps<TableBodyRowsProps<T>>()
</script>

<template>

  <main class="ht-body-rows-container">
    <li class="ht-body-row-wrapper" v-for="item in props.rows" :key="item?._rowId">
      <ul class="ht-body-row" :style="{ minHeight: `${props.rowHeight}px` }">
        <li class="ht-body-col" v-for="col in props.columnDefs" :key="col.colId" :style="{
          minWidth: `${props.colsWidthData[col.colId].actualWidth}px`,
          width: `${props.colsWidthData[col.colId].actualWidth}px`,
        }">
          <span class="ht-body-col-value" v-html="col.colId ? item?.rowData?.[col.colId]?.valueToRender : '-'"></span>
        </li>
      </ul>
    </li>
  </main>
</template>

<style scoped>
main.ht-body-rows-container {
  width: 100%;
  height: 100%;
}

li.ht-body-row-wrapper {
  display: flex;
  align-items: center;
}

li.ht-body-row-wrapper:not(:last-of-type) {
  border-bottom: 1px solid var(--ht-body-row-border-color);
}

li.ht-body-row-wrapper:nth-of-type(odd) {
  background-color: var(--ht-body-row-odd-bg-color);
}

li.ht-body-row-wrapper:nth-of-type(even) {
  background-color: var(--ht-body-row-even-bg-color);
}

li.ht-body-row-wrapper:hover {
  background-color: var(--ht-body-row-hover-bg-color);
}

.ht-body-row {
  display: flex;
  align-items: center;
  width: 100%;
  height: auto;
  list-style: none;
  margin: 0;
  padding: 0;

  font-family: var(--ht-body-row-font-family);
  font-size: var(--ht-body-row-font-size);
  font-weight: var(--ht-body-row-font-weight);
  color: var(--ht-body-row-text-color);

}

.ht-body-col {
  display: flex;
  padding: 0 var(--ht-body-cell-horizontal-padding);
  white-space: nowrap;
  box-sizing: border-box;
}

.ht-body-col-value {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
