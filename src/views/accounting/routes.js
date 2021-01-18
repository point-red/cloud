import AccountingMenu from './Index'
import AccountingChartOfAccount from './chart-of-account/routes'
import AccountingCutOff from './cut-off/routes'
import AccountingBalanceSheet from './balance-sheet/routes'
import AccountingProfitAndLoss from './profit-and-loss/routes'
import AccountingRatioReport from './ratio-report/routes'
import AccountingJournal from './journal/routes'

export default [
  { path: '/accounting', name: 'AccountingMenu', component: AccountingMenu },
  ...AccountingChartOfAccount,
  ...AccountingCutOff,
  ...AccountingBalanceSheet,
  ...AccountingProfitAndLoss,
  ...AccountingRatioReport,
  ...AccountingJournal
]
