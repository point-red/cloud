export default [
  { path: '/sales/order', name: 'sales.order.index', component: () => import('./Index') },
  { path: '/sales/order/create', name: 'sales.order.create', component: () => import('./Create') },
  { path: '/sales/order/:id', name: 'sales.order.show', component: () => import('./Show') },
  { path: '/sales/order/:id/edit', name: 'sales.order.edit', component: () => import('./Edit') }
]
