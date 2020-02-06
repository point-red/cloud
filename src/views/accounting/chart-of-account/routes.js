import Index from './Index'
import Create from './Create'
import Edit from './Edit'
import Show from './Show'

export default [
  { path: '/accounting/chart-of-account/create', name: 'accounting.chart-of-account.create', component: Create },
  { path: '/accounting/chart-of-account/:id/edit', name: 'accounting.chart-of-account.edit', component: Edit },
  { path: '/accounting/chart-of-account/:id', name: 'accounting.chart-of-account.show', component: Show },
  { path: '/accounting/chart-of-account', name: 'accounting.chart-of-account', component: Index }
]
