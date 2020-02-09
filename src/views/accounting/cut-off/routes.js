import AccountingCutOff from './Index'
import AccountingCutOffCreate from './Create'
import AccountingCutOffCreateAccount from './CreateAccount'
import AccountingCutOffCreateInventory from './CreateInventory'
import AccountingCutOffShow from './Show'

export default [
  { path: '/accounting/cut-off/create', name: 'accounting.cut.off.create', component: AccountingCutOffCreate },
  { path: '/accounting/cut-off/create/account', name: 'accounting.cut.off.create.account', component: AccountingCutOffCreateAccount },
  { path: '/accounting/cut-off/create/inventory', name: 'accounting.cut.off.create.inventory', component: AccountingCutOffCreateInventory },
  { path: '/accounting/cut-off/:id', name: 'accounting.cut.off.show', component: AccountingCutOffShow },
  { path: '/accounting/cut-off', name: 'accounting.cut.off', component: AccountingCutOff }
]
