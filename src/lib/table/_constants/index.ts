import type { PaginationPageSizeSelectorType, SyncTableStateType } from '../_models'

export const TABLE_DEFAULT_PAGE_SIZE_SELECTOR_VALUE: Exclude<
  PaginationPageSizeSelectorType,
  boolean
> = [25, 50, 100]
export const TABLE_DEFAULT_SYNC_STATE_STRATEGY_VALUE: Exclude<SyncTableStateType, boolean> =
  'queryParam'

export const TABLE_WRAPPER_ELEMENT_ID_SELECTOR: string = 'HT_TABLE_WRAPPER_ELEMENT_ID_SELECTOR'
export const TABLE_BODY_ELEMENT_ID_SELECTOR: string = 'TABLE_BODY_ELEMENT_ID_SELECTOR'
export const TABLE_HEADER_ROW_ELEMENT_ID_SELECTOR: string = 'TABLE_HEADER_ROW_ELEMENT_ID_SELECTOR'
export const TABLE_DEFAULT_ICONS: {
  SORT_ASCENDING: string
  SORT_DESCENDING: string
  FILTER: string
  FIRST: string
  PREVIOUS: string
  NEXT: string
  LAST: string
} = {
  SORT_ASCENDING:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2"> <path d="M6 15l6 -6l6 6"></path> </svg> ',
  SORT_DESCENDING:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2"> <path d="M6 9l6 6l6 -6"></path> </svg>',
  FILTER:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2"><path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z"></path></svg>',
  FIRST:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2"> <path d="M7 6v12"></path> <path d="M18 6l-6 6l6 6"></path> </svg> ',
  PREVIOUS:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2"> <path d="M15 6l-6 6l6 6"></path> </svg>',
  NEXT: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2"> <path d="M9 6l6 6l-6 6"></path> </svg>',
  LAST: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2"> <path d="M6 6l6 6l-6 6"></path> <path d="M17 5v13"></path> </svg>',
}
