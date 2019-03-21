import Create from './Create'
import Index from './Index'
import Show from './Show'
import Edit from './Edit'

export default [
  { path: '/human-resource/employee/:id/salary/create', name: 'EmployeeSalaryCreate', component: Create },
  { path: '/human-resource/employee/:id/salary', name: 'EmployeeSalaryIndex', component: Index },
  { path: '/human-resource/employee/:id/salary/:salaryId', name: 'EmployeeSalaryShow', component: Show },
  { path: '/human-resource/employee/:id/salary/:salaryId/edit', name: 'EmployeeSalaryEdit', component: Edit }
]
