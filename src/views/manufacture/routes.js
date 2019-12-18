import Manufacture from '@/views/manufacture/Index'
import Machine from './machine/routes'
import Process from './process/routes'
import Formula from './formula/routes'
import ProcessIO from './process-io/routes'

export default [
  { path: '/manufacture', name: 'Manufacture', component: Manufacture },
  ...Machine,
  ...Process,
  ...Formula,
  ...ProcessIO
]
