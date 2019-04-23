import PurchaseReceiveIndex from '@/views/purchase/receive/Index'
import PurchaseReceivePending from '@/views/purchase/receive/Pending'
import PurchaseReceiveCreate from '@/views/purchase/receive/Create'
import PurchaseReceiveShow from '@/views/purchase/receive/Show'
import PurchaseReceiveEdit from '@/views/purchase/receive/Edit'

export default [
  { path: '/purchase/receive', name: 'purchase.receive.index', component: PurchaseReceiveIndex },
  { path: '/purchase/receive/pending', name: 'purchase.receive.pending', component: PurchaseReceivePending },
  { path: '/purchase/receive/create', name: 'purchase.receive.create', component: PurchaseReceiveCreate },
  { path: '/purchase/receive/:id', name: 'purchase.receive.show', component: PurchaseReceiveShow },
  { path: '/purchase/receive/:id/edit', name: 'purchase.receive.edit', component: PurchaseReceiveEdit }
]
