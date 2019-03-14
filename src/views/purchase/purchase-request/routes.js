import PurchaseRequestIndex from '@/views/purchase/purchase-request/Index'
import PurchaseRequestCreate from '@/views/purchase/purchase-request/Create'
import PurchaseRequestShow from '@/views/purchase/purchase-request/Show'
import PurchaseRequestEdit from '@/views/purchase/purchase-request/Edit'

export default [
  { path: '/purchase/purchase-request', name: 'purchase.request.index', component: PurchaseRequestIndex },
  { path: '/purchase/purchase-request/create', name: 'purchase.request.create', component: PurchaseRequestCreate },
  { path: '/purchase/purchase-request/:id', name: 'purchase.request.show', component: PurchaseRequestShow },
  { path: '/purchase/purchase-request/:id/edit', name: 'purchase.request.edit', component: PurchaseRequestEdit }
]
