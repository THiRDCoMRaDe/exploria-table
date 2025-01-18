import type { maybeNull } from '@/_core'
import type {
  TableColsBaseDataInterface,
  TableColsSortDataInterface,
  TableColsWidthDataInterface,
} from './column.model'
import type { MultiSortKeyType } from './main.model'

export interface TableHeaderColsBaseDataInterface extends TableColsBaseDataInterface {}
export interface TableHeaderColsWidthDataInterface extends TableColsWidthDataInterface {}
export interface TableHeaderColsSortDataInterface extends TableColsSortDataInterface {}
export interface TableHeaderPropsInterface {
  colsBaseData: TableHeaderColsBaseDataInterface[]
  colsWidthData: TableHeaderColsWidthDataInterface
  colsSortData: TableHeaderColsSortDataInterface
  scrollLeft: number
  headerHeight: number
  icons: {
    sortAscending: string
    sortDescending: string
  }
}

export type TableHeaderColSortChangeEventHeldDownKeyboardKeyType = MultiSortKeyType
export interface TableHeaderColumnSortChangeEventInterface {
  colId: string
  heldDownKeyboardKey: maybeNull<TableHeaderColSortChangeEventHeldDownKeyboardKeyType>
}
export interface TableHeaderColumnWidthChangeEventInterface {
  colId: string
  width: number
}
export interface TableHeaderEmitsInterface {
  columnSortChange: [event: TableHeaderColumnSortChangeEventInterface]
  columnWidthChange: [event: TableHeaderColumnWidthChangeEventInterface]
}
