export default [
  { path: '/sales/delivery-order', name: 'sales.delivery-order.index', component: () => import('./Index') },
  { path: '/sales/delivery-order/create', name: 'sales.delivery-order.create', component: () => import('./Create') },
  { path: '/sales/delivery-order/approval', name: 'sales.delivery-order.approval', component: () => import('./Approval') },
  { path: '/sales/delivery-order/:id', name: 'sales.delivery-order.show', component: () => import('./Show') },
  { path: '/sales/delivery-order/:id/edit', name: 'sales.delivery-order.edit', component: () => import('./Edit') },
  { path: '/sales/delivery-order/:id/histories', name: 'sales.delivery-order.histories', component: () => import('./Histories') }
]
