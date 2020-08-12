import PurchaseRequest from './request/routes'
import PurchaseOrder from './order/routes'
import PurchaseDownPayment from './down-payment/routes'
import PurchaseReceive from './receive/routes'
import PurchaseInvoice from './invoice/routes'

export default [
  { path: '/purchase', name: 'Purchase', component: () => import('./Index') },
  ...PurchaseRequest,
  ...PurchaseOrder,
  ...PurchaseDownPayment,
  ...PurchaseReceive,
  ...PurchaseInvoice
]
