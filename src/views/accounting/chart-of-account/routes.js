import Index from './Index'
import Show from './Show'

export default [
  { path: '/accounting/chart-of-account/:id', name: 'accounting.chart-of-account.show', component: Show },
  { path: '/accounting/chart-of-account', name: 'accounting.chart-of-account', component: Index }
]
