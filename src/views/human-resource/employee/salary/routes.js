import Create from './Create'
import Index from './Index'
import Show from './Show'
import Edit from './Edit'
import ShowBy from './ShowBy'

export default [
  { path: '/human-resource/employee/:id/salary/create', name: 'humanResourceEmployeeSalaryCreate', component: Create },
  { path: '/human-resource/employee/:id/salary', name: 'humanResourceEmployeeSalaryIndex', component: Index },
  { path: '/human-resource/employee/:id/salary/:salaryId', name: 'humanResourceEmployeeSalaryShow', component: Show },
  { path: '/human-resource/employee/:id/salary/:salaryId/edit', name: 'humanResourceEmployeeSalaryEdit', component: Edit },
  { path: '/human-resource/employee/:id/salary-by/:value/:type', name: 'humanResourceEmployeeSalaryShowBy', component: ShowBy }
]
