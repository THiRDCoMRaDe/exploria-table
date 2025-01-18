import type { TableColDefInterface, TableColsWidthDataInterface } from './column.model'
import type { TableRecordsInterface } from './main.model'

export interface TableBodyLayoutProps {
  colsTotalWidth: number
  totalRowsCount: number
}
export interface TableBodyLayoutScrollChangeEventInterface {
  top: number
  left: number
}
export interface TableBodyLayoutEmitsInterface {
  scrollChange: [event: TableBodyLayoutScrollChangeEventInterface]
}
export interface TableBodyRowsColsWidthDataInterface extends TableColsWidthDataInterface {}
export interface TableBodyRowsProps<T> {
  rows: TableRecordsInterface<T>[]
  columnDefs: Required<TableColDefInterface<T, any>>[] | []
  rowHeight: number
  colsWidthData: TableBodyRowsColsWidthDataInterface
}
