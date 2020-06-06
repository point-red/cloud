import PurchaseDownPaymentIndex from '@/views/purchase/down-payment/Index'
import PurchaseDownPaymentCreate from '@/views/purchase/down-payment/Create'
import PurchaseDownPaymentShow from '@/views/purchase/down-payment/Show'
import PurchaseDownPaymentEdit from '@/views/purchase/down-payment/Edit'

export default [
  { path: '/purchase/down-payment', name: 'purchase.down-payment.index', component: PurchaseDownPaymentIndex },
  { path: '/purchase/down-payment/create', name: 'purchase.down-payment.create', component: PurchaseDownPaymentCreate },
  { path: '/purchase/down-payment/:id', name: 'purchase.down-payment.show', component: PurchaseDownPaymentShow },
  { path: '/purchase/down-payment/:id/edit', name: 'purchase.down-payment.edit', component: PurchaseDownPaymentEdit }
]
