import EmployeeIndex from '@/views/human-resource/employee/Index'
import EmployeeShow from '@/views/human-resource/employee/Show'
import EmployeeCreate from '@/views/human-resource/employee/Create'
import EmployeeEdit from '@/views/human-resource/employee/Edit'
import EmployeeAssessment from '@/views/human-resource/employee/assessment/routes'
import EmployeeSalary from '@/views/human-resource/employee/salary/routes'

export default [
  { path: '/human-resource/employee', name: 'EmployeeIndex', component: EmployeeIndex },
  { path: '/human-resource/employee/create', name: 'EmployeeCreate', component: EmployeeCreate },
  { path: '/human-resource/employee/:id', name: 'EmployeeShow', component: EmployeeShow },
  { path: '/human-resource/employee/:id/edit', name: 'EmployeeEdit', component: EmployeeEdit },
  ...EmployeeAssessment,
  ...EmployeeSalary
]
