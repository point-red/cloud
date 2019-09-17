import ClosedBillIndex from '@/views/pos/closed-bill/Index'
import ClosedBillShow from '@/views/pos/closed-bill/Show'

export default [
  { path: '/pos/closed-bill', name: 'pos.closed-bill.index', component: ClosedBillIndex },
  { path: '/pos/closed-bill/:id', name: 'pos.closed-bill.show', component: ClosedBillShow }
]
