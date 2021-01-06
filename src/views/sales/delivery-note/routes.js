export default [
  { path: '/sales/delivery-note', name: 'sales.delivery-note.index', component: () => import('./Index') },
  { path: '/sales/delivery-note/create', name: 'sales.delivery-note.create', component: () => import('./Create') },
  { path: '/sales/delivery-note/:id', name: 'sales.delivery-note.show', component: () => import('./Show') },
  { path: '/sales/delivery-note/:id/edit', name: 'sales.delivery-note.edit', component: () => import('./Edit') }
]
