import Index from '@/views/finance/cash/Index'
import Out from '@/views/finance/cash/Out'
import In from '@/views/finance/cash/In'
import Show from '@/views/finance/cash/Show'
import Edit from '@/views/finance/cash/Edit'

export default [
  { path: '/finance/cash', name: 'finance.cash.index', component: Index },
  { path: '/finance/cash/out', name: 'finance.cash.out', component: Out },
  { path: '/finance/cash/in', name: 'finance.cash.in', component: In },
  { path: '/finance/cash/:id', name: 'finance.cash.show', component: Show },
  { path: '/finance/cash/:id/edit', name: 'finance.cash.edit', component: Edit }
]
