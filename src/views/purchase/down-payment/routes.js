export default [
  { path: '/purchase/down-payment', name: 'purchase.down-payment.index', component: () => import('./Index') },
  { path: '/purchase/down-payment/create', name: 'purchase.down-payment.create', component: () => import('./Create') },
  { path: '/purchase/down-payment/:id', name: 'purchase.down-payment.show', component: () => import('./Show') },
  { path: '/purchase/down-payment/:id/edit', name: 'purchase.down-payment.edit', component: () => import('./Edit') }
]
