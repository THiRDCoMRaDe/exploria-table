<script setup lang="ts" generic="T">
import { computed, onMounted, ref, toRef, toValue, useTemplateRef, watch, type ComputedRef, type Ref, type ShallowRef } from 'vue'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'
import { TABLE_DEFAULT_PAGE_SIZE_SELECTOR_VALUE, TABLE_DEFAULT_SYNC_STATE_STRATEGY_VALUE, TABLE_WRAPPER_ELEMENT_ID_SELECTOR, TABLE_DEFAULT_ICONS } from '../_constants'
import {
  asap,
  debounce,
  generateRandomString,
  hasValue,
  isEmptyObject,
  removeElementsWithValue,
} from '../_helpers'
import type {
  maybeNull,
  PaginationPageSizeSelectorType,
  Permutations,
  RequiredTableOptionInterface,
  SyncTableStrategyType,
  TableApiInterface,
  TableBodyLayoutScrollChangeEventInterface,
  TableColDefInterface,
  TableColFilterType,
  TableColRegExFilterActiveConfig,
  TableColsBaseDataInterface,
  TableColsFilterDataInterface,
  TableColSortOptionType,
  TableColsSortDataInterface,
  TableColsWidthDataInterface,
  TableColTextFilterActiveConfig,
  TableColTextFilterConfig,
  TableColTextFilterOption,
  TableColumnValueComparatorEventInterface,
  TableDimensionsInterface,
  TableFilterRegExFilterChangeEventInterface,
  TableFilterTextFilterChangeEventInterface,
  TableHeaderColumnSortChangeEventInterface,
  TableHeaderColumnWidthChangeEventInterface,
  TableMainProps,
  TablePaginationSummaryPropInterface,
  TableRecordsInterface,
  TableRecordsRowDataInterface,
  tableVisibleRowsDataInterface,
} from '../_models'
import './../assets/styles/variables.css'
import './../assets/styles/fonts.css'
import './../assets/styles/reset.css'
import './../assets/styles/inputs.css'

import TableHeader from './TableHeader.vue'
import TableFilterLayout from './TableFilterLayout.vue'
import TableFilterText from './TableFilterText.vue'
import TableFilterRegEx from './TableFilterRegEx.vue'
import TablePaginationPanel from './TablePaginationPanel.vue'
import TableBodyLayout from './TableBodyLayout.vue'
import TableBodyRows from './TableBodyRows.vue'
const api: TableApiInterface = {
  paginationGetTotalPages: () => {
    return acceptableTotalPageNumber.value
  },
  paginationGetPageSize: () => {
    return activePageSize.value
  },
  paginationGoToPage: (pageNumber) => {
    pageNumberState.value = {
      type: 'tableApi',
      payload: pageNumber,
    }
  },
  paginationGoToFirstPage: () => {
    pageNumberState.value = {
      type: 'tableApi',
      payload: 1,
    }
  },
  paginationGoToLastPage: () => {
    pageNumberState.value = {
      type: 'tableApi',
      payload: acceptableTotalPageNumber.value,
    }
  },
  paginationSetPageSize: (pageSize) => {
    pageSizeState.value = {
      type: 'tableApi',
      payload: pageSize,
    }
  },
  autoSizeAllColumns: () => {

  }
}

const props = defineProps<TableMainProps<T>>()
const route = useRoute()
const router = useRouter()

const tableRecords: Ref<TableRecordsInterface<T>[]> = ref([])
const tableDimensions: Ref<TableDimensionsInterface> = ref({ width: 0, height: 0 })
const tableCoordinates: Ref<{ x: number; y: number }> = ref({ x: 0, y: 0 })
const tableBodyScroll: Ref<{ top: number; left: number }> = ref({ top: 0, left: 0 })
const tableWrapperElementRef: Readonly<ShallowRef<HTMLElement | null>> = useTemplateRef('tableWrapperElementRef')
const paginationActivePageSummaryData: Ref<TablePaginationSummaryPropInterface> = ref({
  start: 0,
  end: 0,
  total: 0,
})

const pageSizeState: Ref<{
  type: 'tableApi' | 'userSelection' | 'initiateBySavedState' | 'defaultValue'
  payload: number
}> = ref({ type: 'defaultValue', payload: 0 })
const activePageSize: Ref<number> = ref(0)

const pageNumberState: Ref<
  | {
    type: 'tableApi' | 'userSelection' | 'initiateBySavedState' | 'defaultValue'
    payload: number
  }
  | { type: 'validatePageSizeEffect'; payload: { prevPageSize: number; currPageSize: number } }
> = ref({
  type: 'defaultValue',
  payload: 0,
})
const activePageNumber: Ref<number> = ref(1)

const tableColsBaseDataState: Ref<
  | {
    type: 'defaultValue'
    payload: []
  }
  | {
    type: 'initiateByColDef'
    payload: Required<TableColDefInterface<any, any>>[] | []
  }
// | {
//     type: 'tableApi'
//     payload:
//   }
> = ref({
  type: 'defaultValue',
  payload: [],
})
const tableColsBaseData: Ref<TableColsBaseDataInterface[]> = ref([])
const tableColsWidthDataState: Ref<
  | {
    type: 'defaultValue'
    payload: {}
  }
  | {
    type: 'initiateByColDef'
    payload: Required<TableColDefInterface<any, any>>[] | []
  }
  | {
    type: 'userSelection'
    payload: TableHeaderColumnWidthChangeEventInterface
  }
// | {
//     type: 'tableApi'
//     payload:
//   }
> = ref({
  type: 'defaultValue',
  payload: {},
})

const tableColsWidthData: Ref<TableColsWidthDataInterface> = ref({})
const tableColsSortDataState: Ref<
  | {
    type: 'defaultValue'
    payload: {}
  }
  | {
    type: 'initiateByColDef'
    payload: Required<TableColDefInterface<any, any>>[] | []
  }
  | {
    type: 'userSelection'
    payload: TableHeaderColumnSortChangeEventInterface
  }
  | {
    type: 'initiateBySavedState'
    payload: { colId: string; sort: Exclude<TableColSortOptionType, null> }[]
  }
// | {
//     type: 'tableApi'
//     payload:
//   }
> = ref({
  type: 'defaultValue',
  payload: [],
})
const tableColsSortData: Ref<TableColsSortDataInterface> = ref({})
const tableColsMaxSortIndex: Ref<number> = ref(0)
const tableColsFilterData: Ref<TableColsFilterDataInterface> = ref({})
const tableColsFilterDataState: Ref<
  | {
    type: 'defaultValue'
    payload: {}
  }
  | {
    type: 'initiateByColDef'
    payload: Required<TableColDefInterface<any, any>>[] | []
  }
  | {
    type: 'userSelection'
    payload: { colId: string, filter: TableFilterRegExFilterChangeEventInterface | TableFilterTextFilterChangeEventInterface }
  }
  | {
    type: 'initiateBySavedState'
    payload: { colId: string; activeFilter: TableColTextFilterActiveConfig | TableColRegExFilterActiveConfig }[]
  }
// | {
//     type: 'tableApi'
//     payload:
//   }
> = ref({
  type: 'defaultValue',
  payload: [],
})
const defaultComparator = (event: TableColumnValueComparatorEventInterface<any, any>): number => {
  if (!hasValue(event.valueA)) {
    return 1
  } else if (!hasValue(event.valueB)) {
    return -1
  } else if (typeof event.valueA === 'number' && typeof event.valueB === 'number') {
    return event.reverse
      ? Math.sign(event.valueB - event.valueA)
      : Math.sign(event.valueA - event.valueB)
  } else {
    return event.reverse
      ? event.valueB?.toString().localeCompare(event.valueA?.toString())
      : event.valueA?.toString().localeCompare(event.valueB?.toString())
  }
}
const colIdIndexMap: Map<string, number> = new Map<string, number>()
const tableOption: ComputedRef<RequiredTableOptionInterface<T>> = computed(() => {
  colIdIndexMap.clear()
  return {
    name: props.option?.name || '',
    rowHeight: props.option?.rowHeight || 24,
    headerHeight: props.option?.headerHeight || 48,
    footerHeight: props.option?.footerHeight ? props.option?.footerHeight : props.option.pagination ? 40 : 0,
    columnDefs: props.option?.columnDefs
      ? props.option.columnDefs.map((columnDef, i) => {
        const colId = columnDef?.colId || generateRandomString()
        colIdIndexMap.set(colId, i)
        return {
          onCellClick: columnDef?.onCellClick || null,
          headerName: columnDef?.headerName || '',
          field: columnDef?.field || null,
          colId,
          resizable: typeof columnDef?.resizable === 'boolean' ? columnDef?.resizable : false,
          cellClass: columnDef?.cellClass || '',
          headerClass: columnDef?.headerClass || '',
          width: columnDef?.width || -1,
          minWidth: columnDef?.minWidth || -1,
          maxWidth: columnDef?.maxWidth || -1,
          cellRenderer: columnDef?.cellRenderer || null,
          valueGetter: columnDef?.valueGetter || null,
          valueFormatter: columnDef?.valueFormatter || null,
          sort: columnDef?.sort || null,
          sortable: typeof columnDef?.sortable === 'boolean' ? columnDef?.sortable : false,
          sortOptions: columnDef?.sortOptions || ['asc', 'desc', null],
          comparator: columnDef?.comparator || defaultComparator,
          filter: columnDef?.filter !== undefined ? columnDef?.filter : false,
          filterConfig: columnDef?.filterConfig || null
        }
      })
      : [],
    defaultColWidth:
      props.option?.defaultColWidth && props.option.defaultColWidth > 0
        ? props.option.defaultColWidth
        : 100,
    multiSortKey: props.option?.multiSortKey || 'ctrl',
    rowModelType: props.option?.rowModelType || 'clientSide',
    pagination: props.option?.pagination !== undefined ? props.option.pagination : false,
    paginationPageSizeSelector:
      props.option?.paginationPageSizeSelector !== undefined
        ? props.option?.paginationPageSizeSelector
        : true,
    syncTableState: props.option?.syncTableState !== undefined ? props.option.syncTableState : true,
    paginationStrategyOnPageSizeChange: props.option?.paginationStrategyOnPageSizeChange
      ? props.option.paginationStrategyOnPageSizeChange
      : 'reset',
    icons: {
      sortAscending: props.option.icons?.sortAscending || TABLE_DEFAULT_ICONS.SORT_ASCENDING,
      sortDescending: props.option.icons?.sortDescending || TABLE_DEFAULT_ICONS.SORT_DESCENDING,
      filter: props.option.icons?.filter || TABLE_DEFAULT_ICONS.FILTER,
      first: props.option.icons?.first || TABLE_DEFAULT_ICONS.FIRST,
      previous: props.option.icons?.previous || TABLE_DEFAULT_ICONS.PREVIOUS,
      next: props.option.icons?.next || TABLE_DEFAULT_ICONS.NEXT,
      last: props.option.icons?.last || TABLE_DEFAULT_ICONS.LAST,
    },
    getRowId: props.option?.getRowId || (() => generateRandomString()),
  }
})
const sort = <T,>(
  rowsData: TableRecordsInterface<T>[],
  colId: string,
  sort: Exclude<TableColSortOptionType, null>,
  comparator: (event: TableColumnValueComparatorEventInterface<any, any>) => number,
) => {
  rowsData.sort((a, b) =>
    comparator({
      valueA: a.rowData[colId].value,
      valueB: b.rowData[colId].value,
      dataA: a.intactData,
      dataB: b.intactData,
      reverse: sort === 'asc' ? false : true,
    }),
  )
}

const tableVisibleRowsData: ComputedRef<tableVisibleRowsDataInterface<T>> = computed(() => {
  let rowsData = toValue(tableRecords)

  let currentPageData: TableRecordsInterface<T>[] = []
  let start: number = 0
  let end: number = 0
  let totalVisibleItemsCount: number = 0
  let pageSize = activePageSize.value
  if (rowsData.length) {
    const filterRules = Object.entries(tableColsFilterData.value).filter(col => col[1].type && col[1].activeFilter?.term)

    if (filterRules.length) {
      rowsData = rowsData.slice().filter(row => {
        return filterRules.every(filterRule => {
          switch (filterRule[1].type) {
            case 'text':
              const isCaseSensitive = filterRule[1].filterConfig?.caseSensitive;
              const searchTerm: string = !isCaseSensitive ? filterRule[1].activeFilter!.term!.toLowerCase() : filterRule[1].activeFilter!.term!
              const rowValue: string = !isCaseSensitive ? row.rowData[filterRule[0]].value.toLowerCase() : row.rowData[filterRule[0]].value
              switch ((filterRule[1].activeFilter as TableColTextFilterActiveConfig).selectedFilterOption) {
                case 'contains':
                  return rowValue.includes(searchTerm);
                case 'equals':
                  return rowValue === searchTerm;
                case 'startsWith':
                  return rowValue.startsWith(searchTerm);
                case 'endsWith':
                  return rowValue.endsWith(searchTerm);
              }
            case 'regEx':
              try {
                const regEx = new RegExp(filterRule[1].activeFilter?.term!)
                return regEx.test(row.rowData[filterRule[0]].value)
              } catch {
                return true
              }
          }

          return true
        })
      })
    }

    const sortRules = Object.entries(tableColsSortData.value)
      .filter((col) => col[1].sort)
      .sort((a, b) => {
        if (a[1].sortIndex === b[1].sortIndex) {
          return 0
        }
        if (a[1].sortIndex === null) {
          return 1
        }
        if (b[1].sortIndex === null) {
          return -1
        }
        return a[1].sortIndex - b[1].sortIndex
      })
    if (sortRules.length) {
      sortRules.forEach((sortRule) => {
        rowsData = rowsData.slice().sort((a, b) => {
          return sortRule[1].comparator!({
            dataA: a.intactData,
            dataB: b.intactData,
            valueA: a.rowData[sortRule[0]].value,
            valueB: b.rowData[sortRule[0]].value,
            reverse: sortRule[1].sort === 'asc' ? false : true,
          })
        })
      })
    }

    rowsData = rowsData.map((rowData) => ({ ...rowData, uuid: '' }))

    start = activePageSize.value * (activePageNumber.value - 1) + 1
    end = activePageSize.value * activePageNumber.value
    if (!rowsData.length) {
      start = 0
      end = 0
    }
    else if (activePageSize.value >= rowsData.length) {
      start = 1
      end = rowsData.length
    }
    if (end > rowsData.length) {
      end = rowsData.length
      pageSize = rowsData.length % activePageSize.value
    }
    totalVisibleItemsCount = rowsData.length
    currentPageData = rowsData.slice(end - pageSize, end)
  }
  return {
    currentPageData,
    extraInfo: {
      currentPageFirstRowNumber: start,
      currentPageLastRowNumber: end,
      currentPageTotalRowsCount: totalVisibleItemsCount,
    },
  }
})

const acceptableTotalPageNumber: ComputedRef<number> = computed(() => {
  return hasValue(activePageSize.value) && paginationActivePageSummaryData.value.total
    ? Math.ceil(paginationActivePageSummaryData.value.total / activePageSize.value)
    : 1
})

const maximumPageSize: ComputedRef<number> = computed(() => {
  return paginationActivePageSummaryData.value.total
})

const acceptablePageSizeSelector: ComputedRef<PaginationPageSizeSelectorType> = computed(() => {
  const pageSizeSelectorValue = toValue(tableOption.value.paginationPageSizeSelector)
  if (typeof pageSizeSelectorValue === 'boolean') {
    return pageSizeSelectorValue ? TABLE_DEFAULT_PAGE_SIZE_SELECTOR_VALUE : pageSizeSelectorValue
  } else {
    return pageSizeSelectorValue.length
      ? removeElementsWithValue(pageSizeSelectorValue, 0)
      : [maximumPageSize.value]
  }
})

const syncTableStateStrategy: ComputedRef<SyncTableStrategyType | null> = computed(() => {
  const syncTableStateValue = toValue(tableOption.value.syncTableState)
  if (typeof syncTableStateValue === 'boolean') {
    return syncTableStateValue ? TABLE_DEFAULT_SYNC_STATE_STRATEGY_VALUE : null
  } else {
    return syncTableStateValue
  }
})
const totalColsWidth: ComputedRef<number> = computed(() => {
  const tableColsWidthDataValue = toValue(tableColsWidthData)
  return Object.keys(tableColsWidthDataValue).reduce((total, colId) => total = total + tableColsWidthDataValue[colId].actualWidth, 0)
})
const onPaginationSizeChange = (size: number) => {
  const prevPageSize: number = toValue(activePageSize.value)
  pageSizeState.value = {
    type: 'userSelection',
    payload: size,
  }
  if (props?.events?.paginationPageSizeChange) {
    props?.events?.paginationPageSizeChange({ size })
  }
  pageNumberState.value = {
    type: 'validatePageSizeEffect',
    payload: { prevPageSize, currPageSize: size },
  }
}
const onPaginationPageChange = (number: number) => {
  pageNumberState.value = {
    type: 'userSelection',
    payload: number,
  }
  if (props?.events?.paginationPageNumberChange) {
    props?.events?.paginationPageNumberChange({ number })
  }
}
const onColumnSortChange = (event: TableHeaderColumnSortChangeEventInterface) => {
  tableColsSortDataState.value = {
    type: 'userSelection',
    payload: event,
  }
}

const onColumnWidthChange = (event: TableHeaderColumnWidthChangeEventInterface) => {
  tableColsWidthDataState.value = {
    type: 'userSelection',
    payload: event,
  }
}

const onFilterRegExFilterChange = (colId: string, filterTerm: TableFilterRegExFilterChangeEventInterface) => {
  tableColsFilterDataState.value = {
    type: 'userSelection',
    payload: { colId, filter: filterTerm },
  }
}
const onFilterTextFilterChange = (colId: string, filterTerm: TableFilterTextFilterChangeEventInterface) => {
  tableColsFilterDataState.value = {
    type: 'userSelection',
    payload: { colId, filter: filterTerm },
  }
}
const onBodyLayoutScrollChange = (event: TableBodyLayoutScrollChangeEventInterface) => {
  tableBodyScroll.value = event
}
const initiateTableState = (strategy: SyncTableStrategyType) => {
  const validatePageSizeParam = (
    pageSizeParamValue: LocationQueryValue | LocationQueryValue[],
  ): { isValid: boolean } => {
    if (Array.isArray(pageSizeParamValue)) {
      return { isValid: false }
    }
    if (pageSizeParamValue === null || pageSizeParamValue === undefined) {
      return { isValid: false }
    }
    const numericPageSize: number = Number(pageSizeParamValue)
    if (isNaN(numericPageSize)) {
      return { isValid: false }
    }

    return { isValid: true }
  }
  const validatePageNumberParam = (
    pageNumberParamValue: LocationQueryValue | LocationQueryValue[],
  ): { isValid: boolean } => {
    if (Array.isArray(pageNumberParamValue)) {
      return { isValid: false }
    }
    if (pageNumberParamValue === null || pageNumberParamValue === undefined) {
      return { isValid: false }
    }
    const numericPageNumber: number = Number(pageNumberParamValue)
    if (isNaN(numericPageNumber)) {
      return { isValid: false }
    }

    return { isValid: true }
  }
  const validateColumnsSortParam = (
    columnsSortParamValue: LocationQueryValue | LocationQueryValue[],
  ): {
    isValid: boolean
    data: { colId: string; sort: Exclude<TableColSortOptionType, null> }[] | null
  } => {
    if (Array.isArray(columnsSortParamValue)) {
      return { isValid: false, data: null }
    }
    if (columnsSortParamValue === null || columnsSortParamValue === undefined) {
      return { isValid: false, data: null }
    }
    const columnsSortParsedData = parseColumnsSortStateQueryParams(columnsSortParamValue)
    if (!columnsSortParsedData.length) {
      return { isValid: false, data: null }
    }

    if (!columnsSortParsedData.every((col) => colIdIndexMap.has(col[0]))) {
      return { isValid: false, data: null }
    }
    if (!columnsSortParsedData.every((col) => col[1] === 'asc' || col[1] === 'desc')) {
      return { isValid: false, data: null }
    }

    return {
      isValid: true,
      data: columnsSortParsedData.map((col) => ({ colId: col[0], sort: col[1] as 'asc' | 'desc' })),
    }
  }

  const validateColumnsFilterParam = (
    columnsFilterParamValue: LocationQueryValue | LocationQueryValue[],
  ): {
    isValid: boolean
    data: { colId: string; activeFilter: TableColTextFilterActiveConfig | TableColRegExFilterActiveConfig }[] | null
  } => {
    if (Array.isArray(columnsFilterParamValue)) {
      return { isValid: false, data: null }
    }
    if (columnsFilterParamValue === null || columnsFilterParamValue === undefined) {
      return { isValid: false, data: null }
    }
    const columnsSortParsedData = parseColumnsFilterStateQueryParams(columnsFilterParamValue)
    if (!columnsSortParsedData.length) {
      return { isValid: false, data: null }
    }

    if (!columnsSortParsedData.every((col) => colIdIndexMap.has(col[0]))) {
      return { isValid: false, data: null }
    }
    const validTextOptionType: Permutations<TableColTextFilterOption | ''> = ['contains', 'equals', 'startsWith', 'endsWith', '']
    if (!columnsSortParsedData.every((col) => validTextOptionType.includes(col[2] as TableColTextFilterOption | ''))) {
      return { isValid: false, data: null }
    }

    return {
      isValid: true,
      data: columnsSortParsedData.map((col) => {
        return {
          colId: col[0], activeFilter: {
            term: col[1] === '' ? null : col[1],
            selectedFilterOption: col[2] === '' ? null : col[2],
          }
        }
      }),
    }
  }
  switch (strategy) {
    case 'queryParam':
      const tableName = tableOption.value.name
      const pageSize = route.query[`${tableName}PageSize`]
      const pageNumber = route.query[`${tableName}PageNumber`]
      const columnsSort = route.query[`${tableName}ColumnsSort`]
      const columnsFilter = route.query[`${tableName}ColumnsFilter`]

      if (validatePageSizeParam(pageSize).isValid) {
        pageSizeState.value = {
          type: 'initiateBySavedState',
          payload: Number(pageSize),
        }
      }
      if (validatePageNumberParam(pageNumber).isValid) {
        pageNumberState.value = {
          type: 'initiateBySavedState',
          payload: Number(pageNumber),
        }
      }

      const { data: columnSortParamsData, isValid: isColumnSortParamsValid } =
        validateColumnsSortParam(columnsSort)
      if (isColumnSortParamsValid) {
        tableColsSortDataState.value = {
          type: 'initiateBySavedState',
          payload: columnSortParamsData!,
        }
      }

      const { data: columnFilterParamsData, isValid: isColumnFilterParamsValid } =
        validateColumnsFilterParam(columnsFilter)
      if (isColumnFilterParamsValid) {
        tableColsFilterDataState.value = {
          type: 'initiateBySavedState',
          payload: columnFilterParamsData!,
        }
      }
      break
  }
}
const composeColumnsSortStateQueryParams = (sortState: string[][]): string => {
  return sortState
    .map((col) => `${encodeURIComponent(col[0])}-${col[1]}`)
    .join(',')
    .toString()
}
const parseColumnsSortStateQueryParams = (queryParam: string): string[][] | [] => {
  if (queryParam) {
    return queryParam
      .split(',')
      .map((colSortState) => colSortState.split('-'))
      .map((colSortState) => [decodeURIComponent(colSortState[0]), colSortState[1]])
  } else {
    return []
  }
}

const composeColumnsFilterStateQueryParams = (filterState: string[][]): string => {
  return filterState
    .map((col) => `${encodeURIComponent(col[0])}-${col[1]}-${col[2]}`)
    .join(',')
    .toString()
}

const parseColumnsFilterStateQueryParams = (queryParam: string): string[][] | [] => {
  if (queryParam) {
    return queryParam
      .split(',')
      .map((colFilterState) => colFilterState.split('-'))
      .map((colFilterState) => [decodeURIComponent(colFilterState[0]), colFilterState[1], colFilterState[2]])
  } else {
    return []
  }
}
const syncTableState = (
  strategy: SyncTableStrategyType,
  values: {
    pageSize: { prev: null | number; curr: null | number }
    pageNumber: { prev: null | number; curr: null | number }
    columnsSort: { prev: {} | TableColsSortDataInterface; curr: {} | TableColsSortDataInterface }
    columnsFilter: { prev: {} | TableColsFilterDataInterface; curr: {} | TableColsFilterDataInterface }
  },
) => {
  const tableName = tableOption.value.name
  const _keyValuePairState: { key: string; value: string }[] = []
  if (values.pageSize.curr && values.pageSize.curr !== values.pageSize.prev) {
    _keyValuePairState.push({
      key: `${tableName}PageSize`,
      value: values.pageSize.curr.toString(),
    })
  }

  if (values.pageNumber.curr && values.pageNumber.curr !== values.pageNumber.prev) {
    _keyValuePairState.push({
      key: `${tableName}PageNumber`,
      value: values.pageNumber.curr.toString(),
    })
  }
  if (
    !isEmptyObject(values.columnsSort.curr) &&
    JSON.stringify(values.columnsSort.curr) !== JSON.stringify(values.columnsSort.prev)
  ) {
    const columnsSortState = Object.entries(values.columnsSort.curr)
      .filter((col) => col[1].sort)
      .sort((a, b) => a[1].sortIndex! - b[1].sortIndex!)
      .map((col) => [col[0], col[1].sort])

    _keyValuePairState.push({
      key: `${tableName}ColumnsSort`,
      value: composeColumnsSortStateQueryParams(columnsSortState as string[][]),
    })
  }
  if (
    !isEmptyObject(values.columnsFilter.curr) &&
    JSON.stringify(values.columnsFilter.curr) !== JSON.stringify(values.columnsFilter.prev)
  ) {
    const columnsFilterState = Object.entries(values.columnsFilter.curr)
      .filter((col) => col[1].type)
      .map((col) => {
        if (col[1].type === 'text') {
          return [col[0], col[1].activeFilter?.term ? col[1].activeFilter.term : '', (col[1].activeFilter as TableColTextFilterActiveConfig).selectedFilterOption]
        } else {
          return [col[0], col[1].activeFilter?.term ? col[1].activeFilter.term : '', '']
        }
      })

    _keyValuePairState.push({
      key: `${tableName}ColumnsFilter`,
      value: composeColumnsFilterStateQueryParams(columnsFilterState as string[][]),
    })
  }


  switch (strategy) {
    case 'queryParam':
      router.replace({
        ...route,
        query: {
          ...route.query,
          ...Object.fromEntries(_keyValuePairState.map((q) => [q.key, q.value])),
        },
      })
      break
  }
}

const normalizePageNumber = (pageNumber: number): number => {
  if (pageNumber % 1 !== 1) {
    return Math.round(pageNumber)
  }
  return pageNumber
}
const getActualColWidth = (
  width: number | 'auto',
  minWidth: number | 'unset',
  maxWidth: number | 'unset',
  defaultColWidth: number,
): number => {
  let withToCalculate = width === 'auto' ? defaultColWidth : width
  let actualWidth = width === 'auto' ? defaultColWidth : width

  if (minWidth !== 'unset' && withToCalculate <= minWidth) {
    actualWidth = minWidth
  }
  if (maxWidth !== 'unset' && withToCalculate >= maxWidth) {
    actualWidth = maxWidth
  }
  return actualWidth
}
watch(
  [toRef(props.data), toRef(tableOption.value.columnDefs)],
  () => {
    const dataValue = toValue(props.data)
    if (Array.isArray(dataValue) && dataValue.length) {
      tableRecords.value = dataValue?.map((rowData) => ({
        _rowId: tableOption.value.getRowId(rowData),
        intactData: rowData,
        rowData: tableOption.value.columnDefs.reduce((o, col) => {
          const intactColData = col.field
            ? rowData[col.field as string as keyof typeof rowData]
            : undefined
          const value = col.valueGetter
            ? col.valueGetter({ data: rowData, value: intactColData })
            : intactColData
          const colValue: TableRecordsRowDataInterface<typeof rowData>[''] = {
            intactColData,
            value,
            valueToRender: col.cellRenderer
              ? col.cellRenderer({ data: rowData, value })
              : col.valueFormatter
                ? col.valueFormatter({ data: rowData, value })
                : value,
          }
          return {
            ...o,
            [col.colId]: colValue,
          }
        }, {}),
      }))
    } else {
      tableRecords.value = [] as TableRecordsInterface<T>[]
    }
  },
  { immediate: true },
)

watch(
  tableVisibleRowsData,
  () => {
    paginationActivePageSummaryData.value = {
      start: tableVisibleRowsData.value.extraInfo.currentPageFirstRowNumber,
      end: tableVisibleRowsData.value.extraInfo.currentPageLastRowNumber,
      total: tableVisibleRowsData.value.extraInfo.currentPageTotalRowsCount,
    }
  },
  { immediate: true },
)
watch(
  [
    toRef(syncTableStateStrategy),
    activePageSize,
    activePageNumber,
    tableColsSortData,
    tableColsFilterData,
  ],

  (currValues, prevValues) => {
    const debouncedSyncTableState = debounce(() => {
      if (syncTableStateStrategy.value) {
        syncTableState(syncTableStateStrategy.value, {
          pageSize: { prev: prevValues[1], curr: currValues[1] },
          pageNumber: { prev: prevValues[2], curr: currValues[2] },
          columnsSort: { prev: prevValues[3], curr: currValues[3] },
          columnsFilter: { prev: prevValues[4], curr: currValues[4] },
        })
      }
    }, 100)
    debouncedSyncTableState()
  },
)

watch(
  [pageNumberState, () => paginationActivePageSummaryData.value.total],
  () => {
    let value: number = 0
    if (tableRecords.value.length) {
      if (paginationActivePageSummaryData.value.total) {
        switch (pageNumberState.value.type) {
          case 'userSelection':
            value = pageNumberState.value.payload
            break
          case 'tableApi':
          case 'initiateBySavedState':
            const normalizedPageNumber: number = normalizePageNumber(pageNumberState.value.payload)
            if (
              normalizedPageNumber !== pageNumberState.value.payload &&
              normalizedPageNumber === activePageNumber.value
            ) {
              value = pageNumberState.value.payload
              asap(() => {
                value = normalizedPageNumber
              })
            } else if (normalizedPageNumber <= acceptableTotalPageNumber.value) {
              value = normalizedPageNumber
            } else {
              value = acceptableTotalPageNumber.value
            }
            break
          case 'validatePageSizeEffect':
            switch (tableOption.value.paginationStrategyOnPageSizeChange) {
              case 'reset':
                value = 1
                break
              case 'keepFirstRowOfPreviousPageSizeInViewport':
                if (activePageNumber.value === 1) {
                  value = activePageNumber.value
                } else {
                  let calculatedPageNumberBasedOnPrevPageSize = null
                  const indexOfFirstItemInPrevPage =
                    pageNumberState.value.payload.prevPageSize * (activePageNumber.value - 1)
                  calculatedPageNumberBasedOnPrevPageSize = Math.ceil(
                    (indexOfFirstItemInPrevPage + 1) / pageNumberState.value.payload.currPageSize,
                  )
                  value = calculatedPageNumberBasedOnPrevPageSize
                }
                break
            }
            break
          case 'defaultValue':
            value = 1
            break
        }
        if (value > acceptableTotalPageNumber.value) {
          value = acceptableTotalPageNumber.value
        }
      } else {
        value = 0
      }
    } else {
      value = acceptableTotalPageNumber.value
    }
    activePageNumber.value = value
  },
  { immediate: true },
)

watch(
  [pageSizeState, acceptablePageSizeSelector, maximumPageSize],
  () => {
    let value: number = 0
    switch (pageSizeState.value.type) {
      case 'userSelection':
        value = pageSizeState.value.payload
        break
      case 'tableApi':
      case 'initiateBySavedState':
        if (typeof acceptablePageSizeSelector.value === 'boolean') {
          value = maximumPageSize.value
        } else {
          const index = acceptablePageSizeSelector.value.findIndex(
            (p) => p === pageSizeState.value.payload,
          )
          value = index !== -1 ? pageSizeState.value.payload : acceptablePageSizeSelector.value[0]
        }
        break
      case 'defaultValue':
        value =
          typeof acceptablePageSizeSelector.value === 'boolean'
            ? maximumPageSize.value
            : acceptablePageSizeSelector.value[0]
        break
    }
    activePageSize.value = value
  },
  { immediate: true },
)
watch(
  ref(tableOption.value.columnDefs),
  (currValues, prevValues) => {
    const columnDefsValue = toValue(tableOption.value.columnDefs)
    tableColsBaseDataState.value = {
      type: 'initiateByColDef',
      payload: columnDefsValue,
    }
    tableColsWidthDataState.value = {
      type: 'initiateByColDef',
      payload: columnDefsValue,
    }
    tableColsSortDataState.value = {
      type: 'initiateByColDef',
      payload: columnDefsValue,
    }
    tableColsFilterDataState.value = {
      type: 'initiateByColDef',
      payload: columnDefsValue,
    }
  },
  { immediate: true, once: true },
)

watch(
  [tableColsBaseDataState],
  () => {
    let value: TableColsBaseDataInterface[] | null = null

    switch (tableColsBaseDataState.value.type) {
      case 'initiateByColDef':
        value = tableColsBaseDataState.value.payload.length
          ? tableColsBaseDataState.value.payload.map((colDef) => ({
            headerName: colDef.headerName,
            colId: colDef.colId,
            resizable: colDef.resizable,
            headerClass: colDef.headerClass,
          }))
          : []
        break
      case 'defaultValue':
        value = []
        break
    }
    tableColsBaseData.value = value
  },
  { immediate: true },
)
watch(
  [tableColsWidthDataState],
  () => {
    let value: TableColsWidthDataInterface = {}
    switch (tableColsWidthDataState.value.type) {
      case 'initiateByColDef':
        value = tableColsWidthDataState.value.payload.length
          ? tableColsWidthDataState.value.payload.reduce((o, col) => {
            const width = col.width >= 0 ? col.width : 'auto'
            const minWidth = col.minWidth >= 0 ? col.minWidth : 'unset'
            const maxWidth = col.maxWidth >= 0 ? col.maxWidth : 'unset'
            const colValue: TableColsWidthDataInterface[''] = {
              width,
              minWidth,
              maxWidth,
              actualWidth: getActualColWidth(
                width,
                minWidth,
                maxWidth,
                tableOption.value.defaultColWidth,
              ),
            }
            return {
              ...o,
              [col.colId]: colValue,
            }
          }, {})
          : {}
        break
      case 'userSelection':
        const colWidth = tableColsWidthData.value[tableColsWidthDataState.value.payload.colId]
        let actualWidth: number = tableColsWidthDataState.value.payload.width
        if (colWidth.minWidth !== 'unset' && actualWidth <= colWidth.minWidth) {
          actualWidth = colWidth.minWidth
        }
        if (colWidth.maxWidth !== 'unset' && actualWidth >= colWidth.maxWidth) {
          actualWidth = colWidth.maxWidth
        }
        value = {
          [tableColsWidthDataState.value.payload.colId]: {
            ...tableColsWidthData.value[tableColsWidthDataState.value.payload.colId],
            actualWidth,
          },
        }

        break
      case 'defaultValue':
        value = {}
        break
    }
    tableColsWidthData.value = { ...tableColsWidthData.value, ...value }
  },
  { immediate: true },
)

watch(
  [tableColsSortDataState],
  () => {
    let value: TableColsSortDataInterface = {}
    let maxIndex = tableColsMaxSortIndex.value
    switch (tableColsSortDataState.value.type) {
      case 'initiateByColDef':
        value = tableColsSortDataState.value.payload.length
          ? tableColsSortDataState.value.payload.reduce((o, col) => {
            let sortIndex = null
            if (col.sortable && col.sort) {
              maxIndex = maxIndex + 1
              sortIndex = maxIndex
            }
            const colValue: TableColsSortDataInterface[''] = {
              ...col,
              sort: col.sortable ? col.sort : null,
              sortIndex,
            }
            return {
              ...o,
              [col.colId]: colValue,
            }
          }, {})
          : {}
        break
      case 'userSelection':
        value = {}
        const colCurrentSortData =
          tableColsSortData.value[tableColsSortDataState.value.payload.colId]
        const colNextSortIndex =
          (colCurrentSortData.sortOptions.findIndex((s) => s === colCurrentSortData.sort) + 1) %
          colCurrentSortData.sortOptions.length
        const colNextSortValue = colCurrentSortData.sortOptions[colNextSortIndex]
        if (
          tableColsSortDataState.value.payload.heldDownKeyboardKey ===
          tableOption.value.multiSortKey
        ) {
          if (colNextSortValue !== null) {
            // next sort option is either asc or desc
            if (colCurrentSortData.sortIndex === null) {
              maxIndex = maxIndex + 1
              value[tableColsSortDataState.value.payload.colId] = {
                ...colCurrentSortData,
                sort: colNextSortValue,
                sortIndex: maxIndex,
              }
            } else if (colCurrentSortData.sortIndex === maxIndex) {
              value[tableColsSortDataState.value.payload.colId] = {
                ...colCurrentSortData,
                sort: colNextSortValue,
              }
            } else {
              Object.keys(tableColsSortData.value).map((colId) => {
                value[colId] = {
                  ...tableColsSortData.value[colId],
                  sortIndex:
                    tableColsSortData.value[colId].sortIndex !== null
                      ? tableColsSortData.value[colId].sortIndex >
                        (colCurrentSortData.sortIndex as number)
                        ? tableColsSortData.value[colId].sortIndex - 1
                        : tableColsSortData.value[colId].sortIndex
                      : null,
                }
              })
              value[tableColsSortDataState.value.payload.colId].sortIndex = maxIndex
              value[tableColsSortDataState.value.payload.colId].sort = colNextSortValue
            }
          } else {
            // next sort option is null
            if (colCurrentSortData.sortIndex === null) {
              value[tableColsSortDataState.value.payload.colId] = {
                ...colCurrentSortData,
                sort: colNextSortValue,
              }
            } else if (colCurrentSortData.sortIndex === maxIndex) {
              value[tableColsSortDataState.value.payload.colId] = {
                ...colCurrentSortData,
                sort: colNextSortValue,
                sortIndex: null,
              }
              maxIndex = maxIndex - 1
            } else {
              Object.keys(tableColsSortData.value).map((colId) => {
                value[colId] = {
                  ...tableColsSortData.value[colId],
                  sortIndex:
                    tableColsSortData.value[colId].sortIndex !== null &&
                      colCurrentSortData.sortIndex
                      ? tableColsSortData.value[colId].sortIndex > colCurrentSortData.sortIndex
                        ? tableColsSortData.value[colId].sortIndex - 1
                        : tableColsSortData.value[colId].sortIndex
                      : null,
                  sortable: colCurrentSortData.sortable,
                  comparator: colCurrentSortData.comparator,
                }
              })
              value[tableColsSortDataState.value.payload.colId].sortIndex = null
              value[tableColsSortDataState.value.payload.colId].sort = colNextSortValue
              maxIndex = maxIndex - 1
            }
          }
        } else {
          Object.keys(tableColsSortData.value).map((colId) => {
            value[colId] = {
              ...tableColsSortData.value[colId],
              sort: null,
              sortIndex: null,
            }
          })
          maxIndex = colNextSortValue === null ? 0 : 1
          value[tableColsSortDataState.value.payload.colId].sort = colNextSortValue
          value[tableColsSortDataState.value.payload.colId].sortIndex = maxIndex
        }
        break
      case 'initiateBySavedState':
        const colsClearedState = Object.keys(tableColsSortData.value).reduce((o, colId) => {
          return {
            ...o,
            [colId]: {
              ...tableColsSortData.value[colId],
              sort: null,
              sortIndex: null,
            },
          }
        }, {})
        let sortIndex: null | number = 0
        value = {
          ...colsClearedState,
          ...tableColsSortDataState.value.payload.reduce((o, col, index) => {
            sortIndex = tableColsSortData.value[col.colId].sortable ? index + 1 : null
            const colValue: TableColsSortDataInterface[''] = {
              ...tableColsSortData.value[col.colId],
              sort: tableColsSortData.value[col.colId].sortable ? col.sort : tableColsSortData.value[col.colId].sort,
              sortIndex,
            }
            return {
              ...o,
              [col.colId]: colValue,
            }
          }, {}),
        }
        maxIndex = sortIndex
        break
      case 'defaultValue':
        value = {}
        break
    }
    tableColsMaxSortIndex.value = maxIndex
    tableColsSortData.value = { ...tableColsSortData.value, ...value }
  },
  { immediate: true },
)
watch(
  [tableColsFilterDataState],
  () => {
    let value: TableColsFilterDataInterface = {}

    switch (tableColsFilterDataState.value.type) {
      case 'initiateByColDef':
        value = tableColsFilterDataState.value.payload.length
          ? tableColsFilterDataState.value.payload.reduce((o, col) => {
            const type: maybeNull<TableColFilterType> = typeof col.filter !== 'boolean' ? col.filter : col.filter ? 'text' : null;
            const filterConfig: maybeNull<TableColTextFilterConfig> =
              type === 'text'
                ?
                {
                  caseSensitive: typeof col.filterConfig?.caseSensitive === 'boolean' ? col.filterConfig?.caseSensitive : false,
                  filterOptions: col.filterConfig?.filterOptions?.length ? col.filterConfig.filterOptions : ['contains', 'equals', 'startsWith', 'endsWith']
                }
                : null
            const colValue: TableColsFilterDataInterface[''] = {
              type,
              filterConfig,
              activeFilter: type ? type === 'text' ? { term: null, selectedFilterOption: filterConfig!.filterOptions![0] } : { term: null } : null
            }

            return {
              ...o,
              [col.colId]: colValue,
            }
          }, {})
          : {}
        break
      case 'userSelection':
        value[tableColsFilterDataState.value.payload.colId] = {
          ...tableColsFilterData.value[tableColsFilterDataState.value.payload.colId],
          activeFilter: tableColsFilterData.value[tableColsFilterDataState.value.payload.colId].type === 'text' ? {
            term: tableColsFilterDataState.value.payload.filter!.filterTerm,
            selectedFilterOption: (tableColsFilterDataState.value.payload.filter as TableFilterTextFilterChangeEventInterface).selectedFilterOption!
          } : {
            term: tableColsFilterDataState.value.payload.filter!.filterTerm,
          }
        }
        break
      case 'initiateBySavedState':
        const colsClearedState: TableColsFilterDataInterface = Object.keys(tableColsFilterData.value).reduce((o, colId) => {
          return {
            ...o,
            [colId]: {
              ...tableColsFilterData.value[colId],
              activeFilter: tableColsFilterData.value[colId].type === 'text' ? {
                term: null,
                selectedFilterOption: tableColsFilterData.value[colId].filterConfig!.filterOptions![0]
              } : {
                term: null,
              }
            },
          }
        }, {})
        value = {
          ...colsClearedState,
          ...tableColsFilterDataState.value.payload.reduce((o, col, index) => {
            const colValue: TableColsFilterDataInterface[''] = {
              ...tableColsFilterData.value[col.colId],
              activeFilter: tableColsFilterData.value[col.colId].type === 'text' ? {
                term: col.activeFilter.term,
                selectedFilterOption: (col.activeFilter as TableColTextFilterActiveConfig).selectedFilterOption
              } : {
                term: col.activeFilter.term
              }
            }
            return {
              ...o,
              [col.colId]: colValue,
            }
          }, {}),
        }

        break
      case 'defaultValue':
        value = {}
        break
    }
    tableColsFilterData.value = { ...tableColsFilterData.value, ...value }
  },
  { immediate: true },
)
onMounted(() => {
  const tableWrapperRect = tableWrapperElementRef.value!.getBoundingClientRect()
  tableDimensions.value = { width: tableWrapperRect.width, height: tableWrapperRect.height }
  tableCoordinates.value = { x: tableWrapperRect.x, y: tableWrapperRect.y }
  if (syncTableStateStrategy.value) {
    initiateTableState(syncTableStateStrategy.value)
  }
  if (props?.events?.gridReady) {
    props?.events?.gridReady({ api })
  }
})
</script>

<template>
  <main class="ht-wrapper" :id="TABLE_WRAPPER_ELEMENT_ID_SELECTOR" ref="tableWrapperElementRef">
    <TableHeader :cols-base-data="tableColsBaseData" :cols-sort-data="tableColsSortData"
      :cols-width-data="tableColsWidthData" :header-height="tableOption.headerHeight" :icons="{
        sortAscending: tableOption.icons.sortAscending,
        sortDescending: tableOption.icons.sortDescending,
      }" :scroll-left="tableBodyScroll.left" @column-sort-change="onColumnSortChange($event)"
      @column-width-change="onColumnWidthChange($event)">
      <template v-for="(value, key) in tableColsFilterData" :key="key" v-slot:[`filter-${key}`]>
        <template v-if="value.type">
          <TableFilterLayout :icons="{
            filter: tableOption.icons.filter
          }" :modal-x-axis-boundaries="{ from: tableCoordinates.x, to: tableCoordinates.x + tableDimensions.width }"
            :is-active="!!value.activeFilter?.term">
            <template #filterComponent>
              <TableFilterText :active-filter="value.activeFilter! as TableColTextFilterActiveConfig"
                :filter-config="value.filterConfig!" v-if="value.type === 'text'"
                @filter-change="onFilterTextFilterChange(key as string, $event)" />
              <TableFilterRegEx :active-filter="value.activeFilter! as TableColRegExFilterActiveConfig"
                @filter-change="onFilterRegExFilterChange(key as string, $event)" v-if="value.type === 'regEx'" />
            </template>
          </TableFilterLayout>
        </template>
      </template>
    </TableHeader>
    <TableBodyLayout
      :cols-total-width="totalColsWidth <= tableDimensions.width - 2 ? tableDimensions.width - 2 : totalColsWidth"
      :total-rows-count="paginationActivePageSummaryData.total" @scroll-change="onBodyLayoutScrollChange($event)"
      :style="{ maxHeight: tableDimensions.height - tableOption.headerHeight - tableOption.footerHeight + 'px', flexGrow: 1 }">
      <template #rows>
        <TableBodyRows :rows="tableVisibleRowsData.currentPageData" :column-defs="tableOption.columnDefs"
          :row-height="tableOption.rowHeight" :cols-width-data="tableColsWidthData" />
      </template>
    </TableBodyLayout>
    <footer class="ht-footer"
      :style="{ minHeight: tableOption.footerHeight + 'px', maxHeight: tableOption.footerHeight + 'px' }">
      <TablePaginationPanel v-if="tableOption.pagination" :show-size-selector="true"
        :active-page-number="activePageNumber" :page-size-selector="acceptablePageSizeSelector"
        :active-page-size="activePageSize" :active-page-summary-data="paginationActivePageSummaryData"
        :total-page-count="acceptableTotalPageNumber" :icons="{
          first: tableOption.icons.first,
          previous: tableOption.icons.previous,
          next: tableOption.icons.next,
          last: tableOption.icons.last,
        }" @pagination-size-change="onPaginationSizeChange($event)"
        @pagination-page-change="onPaginationPageChange($event)" />
    </footer>
  </main>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue-virtual-scroller/dist/vue-virtual-scroller.css"></style>
<style scoped>
main.ht-wrapper {
  display: flex;
  flex-direction: column;
  font-family: var(--ht-font-family);
  font-size: var(--ht-font-size);
  font-weight: var(--ht-font-weight);
  border: var(--ht-wrapper-border);
  border-radius: var(--ht-wrapper-border-radius);
  overflow: hidden;
}

footer.ht-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 var(--ht-footer-horizontal-padding);
  background-color: var(--ht-footer-bg-color);
  border-top: 1px solid var(--ht-footer-border-color);
}
</style>
