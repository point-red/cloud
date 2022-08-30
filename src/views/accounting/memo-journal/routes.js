import AccountingMemoJournalIndex from './Index'
import AccountingMemoJournalCreate from './Create'
import AccountingMemoJournalShow from './Show'
import AccountingMemoJournalEdit from './Edit'
import AccountingMemoJournalHistories from './Histories'
import AccountingMemoJournalApproval from './Approval'

export default [
  { path: '/accounting/memo-journal', name: 'accounting.memo.journal.index', component: AccountingMemoJournalIndex },
  { path: '/accounting/memo-journal/create', name: 'accounting.memo.journal.create', component: AccountingMemoJournalCreate },
  { path: '/accounting/memo-journal/approval', name: 'accounting.memo.journal.approval', component: AccountingMemoJournalApproval },
  { path: '/accounting/memo-journal/:id', name: 'accounting.memo.journal.show', component: AccountingMemoJournalShow },
  { path: '/accounting/memo-journal/:id/edit', name: 'accounting.memo.journal.edit', component: AccountingMemoJournalEdit },
  { path: '/accounting/memo-journal/:id/histories', name: 'accounting.memo.journal.histories', component: AccountingMemoJournalHistories }
]
