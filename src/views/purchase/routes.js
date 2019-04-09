import Purchase from '@/views/purchase/Index'
import PurchaseRequest from './request/routes'

export default [
  { path: '/purchase', name: 'Purchase', component: Purchase },
  ...PurchaseRequest
]
