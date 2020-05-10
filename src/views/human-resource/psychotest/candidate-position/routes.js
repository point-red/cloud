import CandidatePositionIndex from '@/views/human-resource/psychotest/candidate-position/Index'
import CandidatePositionShow from '@/views/human-resource/psychotest/candidate-position/Show'
import CandidatePositionCreate from '@/views/human-resource/psychotest/candidate-position/Create'
import CandidatePositionEdit from '@/views/human-resource/psychotest/candidate-position/Edit'

export default [
  {
    path: '/human-resource/psychotest/candidate-position',
    name: 'CandidatePositionIndex',
    component: CandidatePositionIndex
  },
  {
    path: '/human-resource/psychotest/candidate-position/create',
    name: 'CandidatePositionCreate',
    component: CandidatePositionCreate
  },
  {
    path: '/human-resource/psychotest/candidate-position/:id',
    name: 'CandidatePositionShow',
    component: CandidatePositionShow
  },
  {
    path: '/human-resource/psychotest/candidate-position/:id/edit',
    name: 'CandidatePositionEdit',
    component: CandidatePositionEdit
  }
]
