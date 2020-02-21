import Manufacture from '@/views/manufacture/Index'
import Machine from './machine/routes'
import Process from './process/routes'
import Formula from './formula/routes'
import Processing from './processing/routes'

export default [
  { path: '/manufacture', name: 'Manufacture', component: Manufacture },
  ...Machine,
  ...Process,
  ...Formula,
  ...Processing
]
