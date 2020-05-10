import Psychotest from '@/views/human-resource/psychotest/Index'
import Candidate from './candidate/routes'
import CandidatePosition from './candidate-position/routes'
import Kraepelin from './kraepelin/routes'
import Papikostick from './papikostick/routes'
import PapikostickCategory from './papikostick-category/routes'
import PositionCategory from './position-category/routes'
import PapikostickQuestion from './papikostick-question/routes'
import PapikostickOption from './papikostick-option/routes'

export default [
  {
    path: '/human-resource/psychotest',
    name: 'Psychotest',
    component: Psychotest
  },
  ...Candidate,
  ...CandidatePosition,
  ...Kraepelin,
  ...Papikostick,
  ...PapikostickCategory,
  ...PositionCategory,
  ...PapikostickQuestion,
  ...PapikostickOption
]
