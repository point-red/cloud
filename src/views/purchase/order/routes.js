export default [
  { path: '/purchase/order', name: 'purchase.order.index', component: () => import('./Index') },
  { path: '/purchase/order/create', name: 'purchase.order.create', component: () => import('./Create') },
  { path: '/purchase/order/:id', name: 'purchase.order.show', component: () => import('./Show') },
  { path: '/purchase/order/:id/edit', name: 'purchase.order.edit', component: () => import('./Edit') }
]
