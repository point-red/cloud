import Manufacture from '@/views/manufacture/Index'
import Machine from './machine/routes'
import Process from './process/routes'

export default [
  { path: '/manufacture', name: 'Manufacture', component: Manufacture },
  ...Machine,
  ...Process
]
