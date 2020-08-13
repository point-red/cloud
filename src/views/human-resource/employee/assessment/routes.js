import Create from './Create'
import Index from './Index'
import Show from './Show'
import Edit from './Edit'
import ShowBy from './ShowBy'

export default [
  { path: '/human-resource/employee/:id/assessment/create', name: 'humanResourceEmployeeAssessmentCreate', component: Create },
  { path: '/human-resource/employee/:id/assessment', name: 'humanResourceEmployeeAssessmentIndex', component: Index },
  { path: '/human-resource/employee/:id/assessment/:kpiId', name: 'humanResourceEmployeeAssessmentShow', component: Show },
  { path: '/human-resource/employee/:id/assessment/:kpiId/edit', name: 'humanResourceEmployeeAssessmentEdit', component: Edit },
  { path: '/human-resource/employee/:id/assessment-by/:value/:type', name: 'humanResourceEmployeeAssessmentShowBy', component: ShowBy }
]
