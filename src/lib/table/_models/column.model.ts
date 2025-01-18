import type { maybeNull, Paths } from './generic.model'

export type TableColSortOptionType = maybeNull<'desc' | 'asc'>

export type TableColFilterType = 'text' | 'regEx'
export type TableColTextFilterOption = 'contains' | 'equals' | 'startsWith' | 'endsWith'

export interface TableColTextFilterConfig {
  filterOptions?: TableColTextFilterOption[]
  caseSensitive?: boolean
}
export interface TableColTextFilterActiveConfig {
  term: maybeNull<string>
  selectedFilterOption: TableColTextFilterOption
}
export interface TableColRegExFilterActiveConfig {
  term: maybeNull<string>
}
export interface TableColumnCellClickedEventInterface<RowData, ColumnValue> {
  value: ColumnValue | undefined
  colDef: TableColDefInterface<RowData, ColumnValue>
}
export interface TableColumnCellRendererEventInterface<RowData, ColumnValue> {
  data: RowData | undefined
  value: ColumnValue | undefined
}
export interface TableColumnValueGetterEventInterface<RowData, ColumnValue> {
  data: RowData | undefined
  value: ColumnValue | undefined
}
export interface TableColumnValueFormatterEventInterface<RowData, ColumnValue> {
  data: RowData | undefined
  value: ColumnValue | undefined
}
export interface TableColumnValueComparatorEventInterface<RowData, ColumnValue> {
  valueA: ColumnValue | undefined
  valueB: ColumnValue | undefined
  dataA: RowData | undefined
  dataB: RowData | undefined
  reverse: boolean
}
export interface TableColDefInterface<RowData = any, ColumnValue = any> {
  onCellClick?: maybeNull<
    (event: TableColumnCellClickedEventInterface<RowData, ColumnValue>) => void
  >
  headerName?: string
  field?: maybeNull<Paths<RowData>>
  colId?: string
  resizable?: boolean
  cellClass?: string
  headerClass?: string
  width?: number
  minWidth?: number
  maxWidth?: number
  cellRenderer?: maybeNull<
    (event: TableColumnCellRendererEventInterface<RowData, ColumnValue>) => HTMLElement | string
  >
  valueGetter?: maybeNull<
    (event: TableColumnValueGetterEventInterface<RowData, ColumnValue>) => any
  >
  valueFormatter?: maybeNull<
    (event: TableColumnValueFormatterEventInterface<RowData, ColumnValue>) => string
  >

  sort?: TableColSortOptionType
  sortable?: boolean
  sortOptions?: TableColSortOptionType[]
  comparator?: maybeNull<
    (event: TableColumnValueComparatorEventInterface<RowData, ColumnValue>) => number
  >
  filter?: TableColFilterType | boolean
  filterConfig?: maybeNull<TableColTextFilterConfig>
}

export interface TableColsBaseDataInterface {
  headerName: string
  colId: string
  resizable: boolean
  headerClass: string
}
export interface TableColsWidthDataInterface {
  [colId: string]: {
    width: number | 'auto'
    minWidth: number | 'unset'
    maxWidth: number | 'unset'
    actualWidth: number
  }
}
export interface TableColsSortDataInterface {
  [colId: string]: {
    sortIndex: maybeNull<number>
    sort: TableColSortOptionType
    sortOptions: TableColSortOptionType[]
    sortable: boolean
    comparator: maybeNull<(event: TableColumnValueComparatorEventInterface<any, any>) => number>
  }
}
export interface TableColsFilterDataInterface {
  [colId: string]: {
    type: maybeNull<TableColFilterType>
    filterConfig: maybeNull<TableColTextFilterConfig>
    activeFilter?: maybeNull<TableColTextFilterActiveConfig | TableColRegExFilterActiveConfig>
  }
}
