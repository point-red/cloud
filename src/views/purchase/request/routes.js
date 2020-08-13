export default [
  { path: '/purchase/request', name: 'purchase.request.index', component: () => import('./Index') },
  { path: '/purchase/request/create', name: 'purchase.request.create', component: () => import('./Create') },
  { path: '/purchase/request/:id', name: 'purchase.request.show', component: () => import('./Show') },
  { path: '/purchase/request/:id/edit', name: 'purchase.request.edit', component: () => import('./Edit') }
]
