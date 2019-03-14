import Purchase from '@/views/purchase/Index'
import PurchaseRequest from './purchase-request/routes'

export default [
  { path: '/purchase', name: 'Purchase', component: Purchase },
  ...PurchaseRequest
]
