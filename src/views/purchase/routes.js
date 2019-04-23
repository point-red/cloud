import Purchase from '@/views/purchase/Index'
import PurchaseRequest from './request/routes'
import PurchaseOrder from './order/routes'
import DownPayment from './down-payment/routes'
import PurchaseReceive from './receive/routes'

export default [
  { path: '/purchase', name: 'Purchase', component: Purchase },
  ...PurchaseRequest,
  ...PurchaseOrder,
  ...DownPayment,
  ...PurchaseReceive
]
