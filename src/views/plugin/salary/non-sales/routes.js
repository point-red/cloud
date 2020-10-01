import JobLocation from './job-location/routes'
import JobValue from './job-value/routes'
import EmployeeList from './employee-list/routes'

export default [
  {
    path: '/plugin/salary/salary-non-sales',
    name: 'Salary non Sales',
    beforeEnter: (to, from, next) => {
      next('/plugin/salary/salary-non-sales/employee-list')
    }
  },
  ...JobLocation,
  ...JobValue,
  ...EmployeeList
]
