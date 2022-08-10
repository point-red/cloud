export default [
  { path: '/sales/payment-collection', name: 'sales.payment-collection.index', component: () => import('./Index') },
  { path: '/sales/payment-collection/create', name: 'sales.payment-collection.create', component: () => import('./Create') },
  { path: '/sales/payment-collection/approval', name: 'sales.payment-collection.approval', component: () => import('./Approval') },
  { path: '/sales/payment-collection/preview', name: 'sales.payment-collection.preview', component: () => import('./Preview') },
  { path: '/sales/payment-collection/:id', name: 'sales.payment-collection.show', component: () => import('./Show') },
  { path: '/sales/payment-collection/:id/edit', name: 'sales.payment-collection.edit', component: () => import('./Edit') },
  { path: '/sales/payment-collection/:id/histories', name: 'sales.payment-collection.histories', component: () => import('./Histories') }
]
