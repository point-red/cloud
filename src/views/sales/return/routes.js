export default [
  { path: '/sales/return', name: 'sales.return.index', component: () => import('./Index') },
  { path: '/sales/return/create', name: 'sales.return.create', component: () => import('./Create') },
  { path: '/sales/return/approval', name: 'sales.return.approval', component: () => import('./Approval') },
  { path: '/sales/return/:id', name: 'sales.return.show', component: () => import('./Show') },
  { path: '/sales/return/:id/edit', name: 'sales.return.edit', component: () => import('./Edit') },
  { path: '/sales/return/:id/histories', name: 'sales.return.histories', component: () => import('./Histories') }
]
