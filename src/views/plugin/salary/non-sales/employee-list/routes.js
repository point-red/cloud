import EmployeeList from './Index.vue'
import EmployeeListShow from './Show.vue'

export default [
  { path: '/plugin/salary/salary-non-sales/employee-list', name: 'nonsales.employee-list.index', component: EmployeeList },
  { path: '/plugin/salary/salary-non-sales/employee-list/:id', name: 'nonsales.employee-list.show', component: EmployeeListShow }
]
