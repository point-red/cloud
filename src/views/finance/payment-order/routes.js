import Index from '@/views/finance/payment-order/Index'
import Create from '@/views/finance/payment-order/Create'
import Show from '@/views/finance/payment-order/Show'
import Edit from '@/views/finance/payment-order/Edit'

export default [
  { path: '/finance/payment-order', name: 'finance.payment-order.index', component: Index },
  { path: '/finance/payment-order/create', name: 'finance.payment-order.create', component: Create },
  { path: '/finance/payment-order/:id', name: 'finance.payment-order.show', component: Show },
  { path: '/finance/payment-order/:id/edit', name: 'finance.payment-order.edit', component: Edit }
]
