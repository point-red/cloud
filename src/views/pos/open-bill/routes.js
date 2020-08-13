export default [
  { path: '/pos/open-bill', name: 'pos.open-bill.index', component: () => import('./Index') },
  { path: '/pos/open-bill/create', name: 'pos.open-bill.create', component: () => import('./Create') },
  { path: '/pos/open-bill/:id', name: 'pos.open-bill.show', component: () => import('./Show') },
  { path: '/pos/open-bill/:id/edit', name: 'pos.open-bill.edit', component: () => import('./Edit') }
]
