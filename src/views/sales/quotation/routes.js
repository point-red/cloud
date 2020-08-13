export default [
  { path: '/sales/quotation', name: 'sales.quotation.index', component: () => import('./Index') },
  { path: '/sales/quotation/create', name: 'sales.quotation.create', component: () => import('./Create') },
  { path: '/sales/quotation/:id', name: 'sales.quotation.show', component: () => import('./Show') },
  { path: '/sales/quotation/:id/edit', name: 'sales.quotation.edit', component: () => import('./Edit') }
]
