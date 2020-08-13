import EmployeeIndex from '@/views/human-resource/employee/Index'
import EmployeeShow from '@/views/human-resource/employee/Show'
import EmployeeAssessment from '@/views/human-resource/employee/assessment/routes'
import EmployeeSalary from '@/views/human-resource/employee/salary/routes'

export default [
  { path: '/human-resource/employee', name: 'EmployeeIndex', component: EmployeeIndex },
  { path: '/human-resource/employee/:id', name: 'EmployeeShow', component: EmployeeShow },
  ...EmployeeAssessment,
  ...EmployeeSalary
]
