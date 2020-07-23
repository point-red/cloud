import AccountingCutOff from './Index'
import AccountingCutOffCreate from './Create'
import AccountingCutOffCreateAccount from './CreateAccount'
import AccountingCutOffCreateInventory from './CreateInventory'
import AccountingCutOffCreateAccountPayable from './CreateAccountPayable'
import AccountingCutOffCreatePurchaseDownPayment from './CreatePurchaseDownPayment'
import AccountingCutOffCreateAccountReceivable from './CreateAccountReceivable'
import AccountingCutOffCreateSalesDownPayment from './CreateSalesDownPayment'
import AccountingCutOffCreateReview from './CreateReview'
import AccountingCutOffShow from './Show'

export default [
  { path: '/accounting/cut-off/create', name: 'accounting.cut.off.create', component: AccountingCutOffCreate },
  { path: '/accounting/cut-off/create/account', name: 'accounting.cut.off.create.account', component: AccountingCutOffCreateAccount },
  { path: '/accounting/cut-off/create/inventory', name: 'accounting.cut.off.create.inventory', component: AccountingCutOffCreateInventory },
  { path: '/accounting/cut-off/create/account-payable', name: 'accounting.cut.off.create.account.payable', component: AccountingCutOffCreateAccountPayable },
  { path: '/accounting/cut-off/create/purchase-down-payment', name: 'accounting.cut.off.create.purchase.down.payment', component: AccountingCutOffCreatePurchaseDownPayment },
  { path: '/accounting/cut-off/create/account-receivable', name: 'accounting.cut.off.create.account.receivable', component: AccountingCutOffCreateAccountReceivable },
  { path: '/accounting/cut-off/create/sales-down-payment', name: 'accounting.cut.off.create.sales.down.payment', component: AccountingCutOffCreateSalesDownPayment },
  { path: '/accounting/cut-off/create/review', name: 'accounting.cut.off.create.review', component: AccountingCutOffCreateReview },
  { path: '/accounting/cut-off/:id', name: 'accounting.cut.off.show', component: AccountingCutOffShow },
  { path: '/accounting/cut-off', name: 'accounting.cut.off', component: AccountingCutOff }
]
