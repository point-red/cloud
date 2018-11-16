import HumanResource from '@/views/human-resource/Index'
import Kpi from './kpi/routes'
import Employee from './employee/routes'

export default [
  { path: '/human-resource', name: 'HumanResource', component: HumanResource },
  ...Kpi,
  ...Employee
]
