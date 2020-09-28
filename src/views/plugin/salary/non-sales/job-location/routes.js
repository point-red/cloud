import JobLocationIndex from './Index'
import JobLocationShow from './Show'

export default [
  { path: '/plugin/salary/salary-non-sales/job-location', name: 'nonsales.job-location.index', component: JobLocationIndex },
  { path: '/plugin/salary/salary-non-sales/job-location/:id', name: 'nonsales.job-location.show', component: JobLocationShow }
]
