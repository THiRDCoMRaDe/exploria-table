import type {
  TableColRegExFilterActiveConfig,
  TableColTextFilterActiveConfig,
  TableColTextFilterConfig,
  TableColTextFilterOption,
} from './column.model'

export interface TableFilterLayoutPropsInterface {
  isActive: boolean
  icons: {
    filter: string
  }
  modalXAxisBoundaries: {
    from: number
    to: number
  }
}

export interface TableFilterTextPropsInterface {
  activeFilter: TableColTextFilterActiveConfig
  filterConfig: TableColTextFilterConfig
}
export interface TableFilterRegExPropsInterface {
  activeFilter: TableColRegExFilterActiveConfig
}

export interface TableFilterRegExFilterChangeEventInterface {
  filterTerm: string | null
}
export interface TableFilterRegExEmitsInterface {
  filterChange: [event: TableFilterRegExFilterChangeEventInterface]
}

export interface TableFilterTextFilterChangeEventInterface {
  selectedFilterOption: TableColTextFilterOption | null
  filterTerm: string | null
}
export interface TableFilterTextEmitsInterface {
  filterChange: [event: TableFilterTextFilterChangeEventInterface]
}

export interface TableFilterTextSelectOptionInterface {
  label: string
  value: TableColTextFilterOption
}
