import AccountingCutOff from './Index'
import AccountingCutOffCreate from './Create'
import AccountingCutOffShow from './Show'

export default [
  { path: '/accounting/cut-off/create', name: 'AccountingCutOffCreate', component: AccountingCutOffCreate },
  { path: '/accounting/cut-off/:id', name: 'AccountingCutOffShow', component: AccountingCutOffShow },
  { path: '/accounting/cut-off', name: 'AccountingCutOff', component: AccountingCutOff }
]
