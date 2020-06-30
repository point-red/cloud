export default [
  { path: '/purchase/receive', name: 'purchase.receive.index', component: () => import('./Index') },
  { path: '/purchase/receive/create', name: 'purchase.receive.create', component: () => import('./Create') },
  { path: '/purchase/receive/:id', name: 'purchase.receive.show', component: () => import('./Show') },
  { path: '/purchase/receive/:id/edit', name: 'purchase.receive.edit', component: () => import('./Edit') }
]
