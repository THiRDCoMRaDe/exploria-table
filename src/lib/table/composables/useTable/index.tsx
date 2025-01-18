/* eslint-disable vue/multi-word-component-names */
import { defineAsyncComponent, defineComponent } from 'vue'
import type {
  TableDataPropType,
  TableEventsInterface,
  TableOptionInterface,
  UseTableResInterface,
} from '../../_models'
const _TableMain = defineAsyncComponent(() => import('../../components/TableMain.vue'))
export function useTable<T>(
  data: TableDataPropType<T>,
  option: TableOptionInterface<T>,
  events: TableEventsInterface,
): UseTableResInterface {
  return {
    TableComponent: defineComponent({
      render: () => (
        <>
          <_TableMain data={data} option={option} events={events} />
        </>
      ),
    }),
  }
}
