import PapikostickOptionIndex from '@/views/human-resource/psychotest/papikostick-option/Index'
import PapikostickOptionShow from '@/views/human-resource/psychotest/papikostick-option/Show'
import PapikostickOptionCreate from '@/views/human-resource/psychotest/papikostick-option/Create'
import PapikostickOptionEdit from '@/views/human-resource/psychotest/papikostick-option/Edit'

export default [
  {
    path: '/human-resource/psychotest/papikostick-option',
    name: 'PapikostickOptionIndex',
    component: PapikostickOptionIndex
  },
  {
    path: '/human-resource/psychotest/papikostick-option/create',
    name: 'PapikostickOptionCreate',
    component: PapikostickOptionCreate
  },
  {
    path: '/human-resource/psychotest/papikostick-option/:id',
    name: 'PapikostickOptionShow',
    component: PapikostickOptionShow
  },
  {
    path: '/human-resource/psychotest/papikostick-option/:id/edit',
    name: 'PapikostickOptionEdit',
    component: PapikostickOptionEdit
  }
]
