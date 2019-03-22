import Index from './Index'
import Show from './Show'

export default [
  { path: '/account/billing', name: 'billing.index', component: Index },
  { path: '/account/billing/:id', name: 'billing.show', component: Show }
]
