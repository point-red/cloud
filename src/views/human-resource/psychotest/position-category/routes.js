import PositionCategoryIndex from '@/views/human-resource/psychotest/position-category/Index'
import PositionCategoryShow from '@/views/human-resource/psychotest/position-category/Show'
import PositionCategoryCreate from '@/views/human-resource/psychotest/position-category/Create'
import PositionCategoryEdit from '@/views/human-resource/psychotest/position-category/Edit'

export default [
  {
    path: '/human-resource/psychotest/position-category',
    name: 'PositionCategoryIndex',
    component: PositionCategoryIndex
  },
  {
    path: '/human-resource/psychotest/position-category/create',
    name: 'PositionCategoryCreate',
    component: PositionCategoryCreate
  },
  {
    path: '/human-resource/psychotest/position-category/:id',
    name: 'PositionCategoryShow',
    component: PositionCategoryShow
  },
  {
    path: '/human-resource/psychotest/position-category/:id/edit',
    name: 'PositionCategoryEdit',
    component: PositionCategoryEdit
  }
]
