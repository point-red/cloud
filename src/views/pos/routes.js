import POS from '@/views/pos/Index'
import OpenBill from './open-bill/routes'
import ClosedBill from './closed-bill/routes'

export default [
  { path: '/pos', name: 'POS', component: POS },
  ...OpenBill,
  ...ClosedBill
]
