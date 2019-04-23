import PurchaseDownPaymentIndex from '@/views/purchase/down-payment/Index'
import PurchaseDownPaymentPending from '@/views/purchase/down-payment/Pending'
import PurchaseDownPaymentShow from '@/views/purchase/down-payment/Show'

export default [
  { path: '/purchase/down-payment', name: 'purchase.down-payment.index', component: PurchaseDownPaymentIndex },
  { path: '/purchase/down-payment/pending', name: 'purchase.down-payment.pending', component: PurchaseDownPaymentPending },
  { path: '/purchase/down-payment/:id', name: 'purchase.down-payment.show', component: PurchaseDownPaymentShow }
]
