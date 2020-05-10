import CandidateIndex from '@/views/human-resource/psychotest/candidate/Index'
import CandidateShow from '@/views/human-resource/psychotest/candidate/Show'
import CandidateCreate from '@/views/human-resource/psychotest/candidate/Create'
import CandidateEdit from '@/views/human-resource/psychotest/candidate/Edit'

export default [
  {
    path: '/human-resource/psychotest/candidate',
    name: 'CandidateIndex',
    component: CandidateIndex
  },
  {
    path: '/human-resource/psychotest/candidate/create',
    name: 'CandidateCreate',
    component: CandidateCreate
  },
  {
    path: '/human-resource/psychotest/candidate/:id',
    name: 'CandidateShow',
    component: CandidateShow
  },
  {
    path: '/human-resource/psychotest/candidate/:id/edit',
    name: 'CandidateEdit',
    component: CandidateEdit
  }
]
