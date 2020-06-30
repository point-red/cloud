export default [
  { path: '/sales/down-payment', name: 'sales.down-payment.index', component: () => import('./Index') },
  { path: '/sales/down-payment/create', name: 'sales.down-payment.create', component: () => import('./Create') },
  { path: '/sales/down-payment/:id', name: 'sales.down-payment.show', component: () => import('./Show') },
  { path: '/sales/down-payment/:id/edit', name: 'sales.down-payment.edit', component: () => import('./Edit') }
]
