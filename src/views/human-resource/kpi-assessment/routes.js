import Index from './Index'
import Edit from './Edit'
import Create from './Create'
import History from './History'

export default [
  { path: '/human-resource/kpi-assessment', name: 'humanResourceKpiAssessmentIndex', component: Index },
  { path: '/human-resource/kpi-assessment/:employeeId', name: 'humanResourceKpiAssessmentCreate', component: Create },
  { path: '/human-resource/kpi-assessment/:employeeId/edit/:assessmentId', name: 'humanResourceKpiAssessmentEdit', component: Edit },
  { path: '/human-resource/kpi-assessment/:employeeId/history', name: 'humanResourceKpiAssessmentHistory', component: History }
]
