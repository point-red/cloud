import EmployeeGroupIndex from '@/views/human-resource/employee-group/Index'
import EmployeeGroupShow from '@/views/human-resource/employee-group/Show'

export default [
  { path: '/human-resource/employee-group', name: 'employee-group.index', component: EmployeeGroupIndex },
  { path: '/human-resource/employee-group/:id', name: 'employee-group.show', component: EmployeeGroupShow }
]
