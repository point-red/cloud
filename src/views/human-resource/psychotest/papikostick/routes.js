import PapikostickIndex from '@/views/human-resource/psychotest/papikostick/Index'
import PapikostickShow from '@/views/human-resource/psychotest/papikostick/Show'

export default [
  {
    path: '/human-resource/psychotest/papikostick',
    name: 'PapikostickIndex',
    component: PapikostickIndex
  },
  {
    path: '/human-resource/psychotest/papikostick/:id',
    name: 'PapikostickShow',
    component: PapikostickShow
  }
]
