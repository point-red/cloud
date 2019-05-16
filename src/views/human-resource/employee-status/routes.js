import EmployeeStatusIndex from '@/views/human-resource/employee-status/Index'
import EmployeeStatusShow from '@/views/human-resource/employee-status/Show'
import EmployeeStatusCreate from '@/views/human-resource/employee-status/Create'
import EmployeeStatusEdit from '@/views/human-resource/employee-status/Edit'

export default [
  { path: '/human-resource/employee-status', name: 'EmployeeStatusIndex', component: EmployeeStatusIndex },
  { path: '/human-resource/employee-status/create', name: 'EmployeeStatusCreate', component: EmployeeStatusCreate },
  { path: '/human-resource/employee-status/:id', name: 'EmployeeStatusShow', component: EmployeeStatusShow },
  { path: '/human-resource/employee-status/:id/edit', name: 'EmployeeStatusEdit', component: EmployeeStatusEdit }
]
