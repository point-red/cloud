import PurchaseRequestIndex from '@/views/purchase/request/Index'
import PurchaseRequestPending from '@/views/purchase/request/Pending'
import PurchaseRequestCreate from '@/views/purchase/request/Create'
import PurchaseRequestShow from '@/views/purchase/request/Show'
import PurchaseRequestEdit from '@/views/purchase/request/Edit'

export default [
  { path: '/purchase/request', name: 'purchase.request.index', component: PurchaseRequestIndex },
  { path: '/purchase/request/pending', name: 'purchase.request.pending', component: PurchaseRequestPending },
  { path: '/purchase/request/create', name: 'purchase.request.create', component: PurchaseRequestCreate },
  { path: '/purchase/request/:id', name: 'purchase.request.show', component: PurchaseRequestShow },
  { path: '/purchase/request/:id/edit', name: 'purchase.request.edit', component: PurchaseRequestEdit }
]
