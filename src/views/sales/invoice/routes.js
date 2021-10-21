export default [
  { path: '/sales/invoice', name: 'sales.invoice.index', component: () => import('./Index') },
  { path: '/sales/invoice/create', name: 'sales.invoice.create', component: () => import('./Create') },
  { path: '/sales/invoice/:id', name: 'sales.invoice.show', component: () => import('./Show') },
  { path: '/sales/invoice/:id/edit', name: 'sales.invoice.edit', component: () => import('./Edit') }
]
