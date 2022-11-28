export default [
  { path: '/purchase/return/create', name: 'purchase.return.create', component: () => import('./Create') },
  { path: '/purchase/return', name: 'purchase.return.index', component: () => import('./Index') },
  { path: '/purchase/return/:id', name: 'purchase.return.show', component: () => import('./Show') }
]
