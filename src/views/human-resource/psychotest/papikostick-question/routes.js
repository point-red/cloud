import PapikostickQuestionIndex from '@/views/human-resource/psychotest/papikostick-question/Index'
import PapikostickQuestionShow from '@/views/human-resource/psychotest/papikostick-question/Show'
import PapikostickQuestionCreate from '@/views/human-resource/psychotest/papikostick-question/Create'
import PapikostickQuestionEdit from '@/views/human-resource/psychotest/papikostick-question/Edit'

export default [
  {
    path: '/human-resource/psychotest/papikostick-question',
    name: 'PapikostickQuestionIndex',
    component: PapikostickQuestionIndex
  },
  {
    path: '/human-resource/psychotest/papikostick-question/create',
    name: 'PapikostickQuestionCreate',
    component: PapikostickQuestionCreate
  },
  {
    path: '/human-resource/psychotest/papikostick-question/:id',
    name: 'PapikostickQuestionShow',
    component: PapikostickQuestionShow
  },
  {
    path: '/human-resource/psychotest/papikostick-question/:id/edit',
    name: 'PapikostickQuestionEdit',
    component: PapikostickQuestionEdit
  }
]
