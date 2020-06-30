import SalesDownPaymentIndex from '@/views/sales/down-payment/Index'
import SalesDownPaymentCreate from '@/views/sales/down-payment/Create'
import SalesDownPaymentShow from '@/views/sales/down-payment/Show'
import SalesDownPaymentEdit from '@/views/sales/down-payment/Edit'

export default [
  { path: '/sales/down-payment', name: 'sales.down-payment.index', component: SalesDownPaymentIndex },
  { path: '/sales/down-payment/create', name: 'sales.down-payment.create', component: SalesDownPaymentCreate },
  { path: '/sales/down-payment/:id', name: 'sales.down-payment.show', component: SalesDownPaymentShow },
  { path: '/sales/down-payment/:id/edit', name: 'sales.down-payment.edit', component: SalesDownPaymentEdit }
]
