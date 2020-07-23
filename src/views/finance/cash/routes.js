import Index from '@/views/finance/cash/Index'
import Out from '@/views/finance/cash/Out'
import In from '@/views/finance/cash/In'
import InShow from '@/views/finance/cash/InShow'
import OutCreate from '@/views/finance/cash/OutCreate'
import OutShow from '@/views/finance/cash/OutShow'

export default [
  { path: '/finance/cash', name: 'finance.cash.index', component: Index },
  { path: '/finance/cash/out/create', name: 'finance.cash.out.create', component: OutCreate },
  { path: '/finance/cash/out/:id', name: 'finance.cash.out.show', component: OutShow },
  { path: '/finance/cash/out', name: 'finance.cash.out', component: Out },
  { path: '/finance/cash/in', name: 'finance.cash.in', component: In },
  { path: '/finance/cash/in/:id', name: 'finance.cash.in.show', component: InShow }
]
