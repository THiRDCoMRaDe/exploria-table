export interface TablePaginationSummaryPropInterface {
  start: number
  end: number
  total: number
}
export interface TablePaginationPropsInterface {
  pageSizeSelector: number[] | boolean
  activePageSize: number
  activePageNumber: number
  totalPageCount: number
  activePageSummaryData: TablePaginationSummaryPropInterface
  icons: {
    first: string
    previous: string
    next: string
    last: string
  }
}
export type PaginationPageChangeEmitActionType = 'first' | 'prev' | 'next' | 'last'
export interface TablePaginationEmitsInterface {
  paginationSizeChange: [size: number]
  paginationPageChange: [pageNumber: number]
}
export interface TablePaginationSelectItemInterface {
  label: string
  value: number
}
