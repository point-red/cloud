export default [
  { path: '/purchase/payment-order', name: 'purchase.payment-order.index', component: () => import('./Index') },
  { path: '/purchase/payment-order/create', name: 'purchase.payment-order.create', component: () => import('./Create') }
]
