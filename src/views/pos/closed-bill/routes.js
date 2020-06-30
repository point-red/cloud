export default [
  { path: '/pos/closed-bill', name: 'pos.closed-bill.index', component: () => import('./Index') },
  { path: '/pos/closed-bill/:id', name: 'pos.closed-bill.show', component: () => import('./Show') }
]
