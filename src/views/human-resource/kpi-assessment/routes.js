import Index from './Index'
import Edit from './Edit'
import Create from './Create'
import History from './History'
import Show from './Show'
import ShowBy from './ShowBy'

export default [
  { path: '/human-resource/kpi/kpi-assessment', name: 'humanResourceKpiAssessmentIndex', component: Index },
  { path: '/human-resource/kpi/kpi-assessment/:employeeId', name: 'humanResourceKpiAssessmentCreate', component: Create },
  { path: '/human-resource/kpi/kpi-assessment/:employeeId/edit/:kpiId', name: 'humanResourceKpiAssessmentEdit', component: Edit },
  { path: '/human-resource/kpi/kpi-assessment/:employeeId/history', name: 'humanResourceKpiAssessmentHistory', component: History },
  { path: '/human-resource/kpi/kpi-assessment/:employeeId/assessment/:kpiId', name: 'humanResourceKpiAssessmentShow', component: Show },
  { path: '/human-resource/kpi/kpi-assessment/:employeeId/assessment-by/:value/:type', name: 'humanResourceKpiAssessmentShowBy', component: ShowBy }

]
