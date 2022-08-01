import Index from '@/views/finance/bank/Index'
import Out from '@/views/finance/bank/Out'
import InIndex from '@/views/finance/bank/InIndex'
import InShow from '@/views/finance/bank/InShow'
import InCreate from '@/views/finance/bank/InCreate'
import OutCreate from '@/views/finance/bank/OutCreate'
import OutShow from '@/views/finance/bank/OutShow'

export default [
  { path: '/finance/bank', name: 'finance.bank.index', component: Index },
  { path: '/finance/bank/out/create', name: 'finance.bank.out.create', component: OutCreate },
  { path: '/finance/bank/out/:id', name: 'finance.bank.out.show', component: OutShow },
  { path: '/finance/bank/out', name: 'finance.bank.out', component: Out },
  { path: '/finance/bank/in', name: 'finance.bank.in', component: InIndex },
  { path: '/finance/bank/in/create', name: 'finance.bank.in.create', component: InCreate },
  { path: '/finance/bank/in/:id', name: 'finance.bank.in.show', component: InShow }
]
