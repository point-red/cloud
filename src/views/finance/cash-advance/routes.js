import Index from '@/views/finance/cash-advance/Index'
import RequestApproveAll from '@/views/finance/cash-advance/RequestApproveAll'
import History from '@/views/finance/cash-advance/History'
import Create from '@/views/finance/cash-advance/Create'
import Show from '@/views/finance/cash-advance/Show'
import Edit from '@/views/finance/cash-advance/Edit'

export default [
  { path: '/finance/cash-advance', name: 'finance.cash-advance.index', component: Index },
  { path: '/finance/cash-advance/request-approve-all', name: 'finance.cash-advance.request-approve-all', component: RequestApproveAll },
  { path: '/finance/cash-advance/history/:number', name: 'finance.cash-advance.history', component: History },
  { path: '/finance/cash-advance/create', name: 'finance.cash-advance.create', component: Create },
  { path: '/finance/cash-advance/:id', name: 'finance.cash-advance.show', component: Show },
  { path: '/finance/cash-advance/:id/edit', name: 'finance.cash-advance.edit', component: Edit }
]
