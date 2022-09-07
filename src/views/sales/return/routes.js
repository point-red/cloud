export default [
  { path: '/sales/return', name: 'sales.return.index', component: () => import('./Index') },
  { path: '/sales/return/create', name: 'sales.return.create', component: () => import('./Create') },
  { path: '/sales/return/:id', name: 'sales.return.show', component: () => import('./Show') }
]
