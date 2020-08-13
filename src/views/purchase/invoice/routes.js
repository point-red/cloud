export default [
  { path: '/purchase/invoice', name: 'purchase.invoice.index', component: () => import('./Index') },
  { path: '/purchase/invoice/create', name: 'purchase.invoice.create', component: () => import('./Create') },
  { path: '/purchase/invoice/:id', name: 'purchase.invoice.show', component: () => import('./Show') },
  { path: '/purchase/invoice/:id/edit', name: 'purchase.invoice.edit', component: () => import('./Edit') }
]
