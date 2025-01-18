import type { maybeNull } from '@/_core'
import type { Component, Ref } from 'vue'
import type { TableColDefInterface } from './column.model'

export interface TableApiInterface {
  paginationGetTotalPages: () => number
  paginationGetPageSize: () => number
  paginationGoToPage: (pageNumber: number) => void
  paginationGoToFirstPage: () => void
  paginationGoToLastPage: () => void
  paginationSetPageSize: (pageSize: number) => void
  autoSizeAllColumns: () => void
}

export interface UseTableResInterface {
  TableComponent: Component
  api?: TableApiInterface
}

export type TableDataPropType<T> = Ref<maybeNull<T[]>> | maybeNull<T[]>
export type PaginationPageSizeSelectorType = number[] | boolean
export type PaginationStrategyOnPageSizeChangeType =
  | 'reset'
  | 'keepFirstRowOfPreviousPageSizeInViewport'
export type SyncTableStateType = 'queryParam' | boolean
export type SyncTableStrategyType = Exclude<SyncTableStateType, boolean>
export type MultiSortKeyType = 'alt' | 'ctrl' | 'shift'
export interface TableIconsInterface {
  sortAscending?: string
  sortDescending?: string
  filter?: string
  first?: string
  previous?: string
  next?: string
  last?: string
}
export interface TableOptionInterface<T> {
  name?: string
  rowHeight?: number
  headerHeight?: number
  footerHeight?: number
  columnDefs?: TableColDefInterface<T, any>[]
  defaultColWidth?: number
  multiSortKey?: MultiSortKeyType
  rowModelType?: 'clientSide' | 'serverSide'
  pagination?: boolean
  paginationPageSizeSelector?: PaginationPageSizeSelectorType
  syncTableState?: SyncTableStateType
  paginationStrategyOnPageSizeChange?: PaginationStrategyOnPageSizeChangeType
  icons?: TableIconsInterface
  getRowId?: (rowData: T) => string
}

export interface RequiredTableOptionInterface<T> extends Required<TableOptionInterface<T>> {
  columnDefs: Required<TableColDefInterface<T, any>>[] | []
  icons: Required<TableIconsInterface>
}

export interface TableEventsInterface {
  paginationPageSizeChange?: (event: { size: number }) => void
  paginationPageNumberChange?: (event: { number: number }) => void
  gridReady?: (event: { api: TableApiInterface }) => void
}

export interface TableMainProps<T> {
  data: TableDataPropType<T>
  option: TableOptionInterface<T>
  events: TableEventsInterface
}
export interface TableRecordsRowDataInterface<T> {
  [colId: string]: {
    intactColData: T[keyof T] | undefined
    value: any
    valueToRender: HTMLElement | string
  }
}
export interface TableRecordsInterface<T> {
  _rowId: string
  intactData: T
  rowData: TableRecordsRowDataInterface<T>
}

export interface TableDataExtraInfoInterface {
  currentPageFirstRowNumber: number
  currentPageLastRowNumber: number
  currentPageTotalRowsCount: number
}
export interface tableVisibleRowsDataInterface<T> {
  currentPageData: TableRecordsInterface<T>[]
  extraInfo: TableDataExtraInfoInterface
}
export interface TableDimensionsInterface {
  width: number
  height: number
}
