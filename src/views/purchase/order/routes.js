import PurchaseOrderIndex from '@/views/purchase/order/Index'
import PurchaseOrderCreate from '@/views/purchase/order/Create'
import PurchaseOrderShow from '@/views/purchase/order/Show'
import PurchaseOrderEdit from '@/views/purchase/order/Edit'

export default [
  { path: '/purchase/order', name: 'purchase.order.index', component: PurchaseOrderIndex },
  { path: '/purchase/order/create', name: 'purchase.order.create', component: PurchaseOrderCreate },
  { path: '/purchase/order/:id', name: 'purchase.order.show', component: PurchaseOrderShow },
  { path: '/purchase/order/:id/edit', name: 'purchase.order.edit', component: PurchaseOrderEdit }
]
