import PapikostickCategoryIndex from '@/views/human-resource/psychotest/papikostick-category/Index'
import PapikostickCategoryShow from '@/views/human-resource/psychotest/papikostick-category/Show'
import PapikostickCategoryCreate from '@/views/human-resource/psychotest/papikostick-category/Create'
import PapikostickCategoryEdit from '@/views/human-resource/psychotest/papikostick-category/Edit'

export default [
  {
    path: '/human-resource/psychotest/papikostick-category',
    name: 'PapikostickCategoryIndex',
    component: PapikostickCategoryIndex
  },
  {
    path: '/human-resource/psychotest/papikostick-category/create',
    name: 'PapikostickCategoryCreate',
    component: PapikostickCategoryCreate
  },
  {
    path: '/human-resource/psychotest/papikostick-category/:id',
    name: 'PapikostickCategoryShow',
    component: PapikostickCategoryShow
  },
  {
    path: '/human-resource/psychotest/papikostick-category/:id/edit',
    name: 'PapikostickCategoryEdit',
    component: PapikostickCategoryEdit
  }
]
