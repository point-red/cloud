import HumanResource from '@/views/human-resource/Index'
import Kpi from './kpi/routes'
import Employee from './employee/routes'
import JobLocation from './job-location/routes'
import EmployeeStatus from './employee-status/routes'
import EmployeeGroup from './employee-group/routes'
import AdditionalComponent from './additional-component/routes'

export default [
  { path: '/human-resource', name: 'HumanResource', component: HumanResource },
  ...Kpi,
  ...Employee,
  ...JobLocation,
  ...EmployeeStatus,
  ...EmployeeGroup,
  ...AdditionalComponent
]
