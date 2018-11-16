import Create from './Create'
import Index from './Index'
import Show from './Show'

export default [
  { path: '/human-resource/employee/:id/assessment/create', name: 'EmployeeAssessmentCreate', component: Create },
  { path: '/human-resource/employee/:id/assessment', name: 'EmployeeAssessmentIndex', component: Index },
  { path: '/human-resource/employee/:id/assessment/:kpiId', name: 'EmployeeAssessmentShow', component: Show }
]
