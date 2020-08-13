import Finance from '@/views/finance/Index'
import PaymentOrder from './payment-order/routes'
import Cash from './cash/routes'
import Bank from './bank/routes'

export default [
  { path: '/finance', name: 'Finance', component: Finance },
  ...PaymentOrder,
  ...Cash,
  ...Bank
]
