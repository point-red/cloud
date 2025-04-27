import Index from './Index'
import Create from './Create'
import Show from './Show'
import Edit from './Edit'
import Calculation from './Calculation'

export default [
  { path: '/human-resource/job-value/assessment', name: 'JobValueAssessmentIndex', component: Index },
  { path: '/human-resource/job-value/assessment/create', name: 'JobValueAssessmentCreate', component: Create },
  { path: '/human-resource/job-value/assessment/:id', name: 'JobValueAssessmentShow', component: Show },
  { path: '/human-resource/job-value/assessment/:id/calculation', name: 'JobValueAssessmentCalculation', component: Calculation },
  { path: '/human-resource/job-value/assessment/edit/:id', name: 'JobValueAssessmentEdit', component: Edit }
]
