import EmployeeStatusIndex from '@/views/human-resource/employee-status/Index'
import EmployeeStatusShow from '@/views/human-resource/employee-status/Show'

export default [
  { path: '/human-resource/employee-status', name: 'employee-status.index', component: EmployeeStatusIndex },
  { path: '/human-resource/employee-status/:id', name: 'employee-status.show', component: EmployeeStatusShow }
]
