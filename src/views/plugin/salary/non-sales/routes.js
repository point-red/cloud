import JobLocation from './job-location/routes'

export default [
  {
    path: '/plugin/salary/salary-non-sales',
    name: 'Salary non Sales',
    beforeEnter: (to, from, next) => {
      next('/plugin/salary/salary-non-sales/job-location')
    }
  },
  ...JobLocation
]
