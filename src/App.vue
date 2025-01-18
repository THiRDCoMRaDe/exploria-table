<script setup lang="ts">
import { format } from 'date-fns'
import type { Ref } from 'vue'
import { ref } from 'vue'
import type { maybeNull, MockDataInterface } from './_core'
import { useFetch } from './composables/useFetch'
import { useTable, type TTApiInterface } from './lib/table'
import { generateRandomString } from './lib/table/_helpers'
const _BASE_URL = location.origin
  ? location.origin
  : !!location.port
    ? `${location.protocol}//${location.hostname}:${location.port}`
    : `${location.protocol}//${location.hostname}`

const { data, execute } = useFetch<MockDataInterface[]>(
  `${_BASE_URL}/_data/records.json`,
  { immediate: false },
)
const mockData: Ref<maybeNull<MockDataInterface[]>> = ref(data)
const tableApi: Ref<maybeNull<TTApiInterface>> = ref(null)
const onFetchClick = () => execute()
const { TableComponent } = useTable<MockDataInterface>(
  mockData,
  {
    columnDefs: [
      {
        headerName: 'ID',
        colId: 'ID',
        field: 'id',
        sortable: false,
        sort: 'asc',
        resizable: true,
        width: 200,
        minWidth: 250,
        maxWidth: 300,
        comparator: ({ valueA, valueB, reverse }) => {
          const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
          return reverse ? collator.compare(valueB, valueA) : collator.compare(valueA, valueB)
        },
      },
      {
        headerName: 'NAME',
        colId: 'NAME',
        field: 'name',
        sortable: true,
        filter: true,
        minWidth: 120,
        filterConfig: {
          caseSensitive: true,
        }
      },
      {
        headerName: 'DATE',
        field: 'date',
        resizable: true,
        minWidth: 60,
        width: 80,
        maxWidth: 224,
        sortable: true,
        comparator: ({ valueA, valueB, reverse }) => {
          return reverse
            ? new Date(valueB).getTime() - new Date(valueA).getTime()
            : new Date(valueA).getTime() - new Date(valueB).getTime()
        },

        cellRenderer: (event) => {
          return format(event.value, 'yyyy/MM/dd HH:mm:ss')
        },
      },
      {
        headerName: 'PHONE',
        colId: 'PHONE',
        field: 'phone',
        sortable: true,
        sort: 'asc',
        filter: 'text',
        filterConfig: {
          filterOptions: ['contains']
        },
      },
      {
        headerName: 'ADDRESS',
        colId: 'ADDRESS',
        field: 'address',
        sortable: true,
        filter: 'regEx',
        valueGetter: (event) => {
          return event.value
        },
        valueFormatter: (event) => {
          return event.value
        },
      },
    ],
    paginationPageSizeSelector: [75, 97, 123],
    // paginationPageSizeSelector: [75],
    pagination: true,
    paginationStrategyOnPageSizeChange: 'keepFirstRowOfPreviousPageSizeInViewport',
    syncTableState: 'queryParam',
    name: 't1',
    rowHeight: 28,
    getRowId: () => generateRandomString(),
  },
  {
    paginationPageSizeChange: ({ size }) => {
      console.log('onPageSizeChange', size)
    },
    gridReady: ({ api }) => {
      tableApi.value = api
    },
  },
)

const goToPage10 = () => {
  tableApi.value?.paginationGoToPage(10)
}
const goToLastPage = () => {
  tableApi.value?.paginationGoToLastPage()
}
const setPageSizeTo15 = () => {
  tableApi.value?.paginationSetPageSize(75)
}


</script>

<template>
  <div class="u-container o-layout">
    <div class="o-buttonsContainer">
      <button @click="onFetchClick()">fetch data</button>

      <button @click="goToPage10()">go to page 10</button>
      <button @click="goToLastPage()">go to last page</button>
      <button @click="setPageSizeTo15()">set page size to 75</button>
    </div>

    <div class="o-tableComponentWrapper">
      <TableComponent>
        <template v-slot:header> header </template>
        <template v-slot:footer> footer </template>
      </TableComponent>
    </div>
  </div>
</template>

<style>
body {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

}

#app {
  display: flex;
  flex-grow: 1;
  width: 100dvw;
  width: 100vw;
  height: 100dvh;
  height: 100vh;
  margin: 0;
  padding: 0;

}
</style>
<style scoped>
.o-layout {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 8px;
  overflow: hidden;
}

.o-buttonsContainer {
  display: flex;
  column-gap: 4px;
}

.o-tableComponentWrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  flex-grow: 1;
  overflow: hidden;

  >* {
    flex-grow: 1;
  }
}
</style>
