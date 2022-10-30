// Import All Cash Page
// Cash Index Page
import Index from '@/views/finance/cash/Index'
// Cash In Page
import In from '@/views/finance/cash/InIndex'
import InCreate from '@/views/finance/cash/InCreate'
import InShow from '@/views/finance/cash/InShow'
// Cash Out Page
import OutCreate from '@/views/finance/cash/OutCreate'
import OutCreatePreview from '@/views/finance/cash/OutCreatePreview'
import OutShow from '@/views/finance/cash/OutShow'

// Export All Cash Page
export default [
  // Cash Index Page
  {
    path: '/finance/cash',
    name: 'finance.cash.index',
    component: Index
  },
  // Cash In Page
  {
    path: '/finance/cash/in',
    name: 'finance.cash.in',
    component: In
  },
  {
    path: '/finance/cash/in/create',
    name: 'finance.cash.in.create',
    component: InCreate
  },
  {
    path: '/finance/cash/in/:id',
    name: 'finance.cash.in.show',
    component: InShow
  },
  // Cash Out Page
  {
    path: '/finance/cash/out/create',
    name: 'finance.cash.out.create',
    component: OutCreate
  },
  {
    path: '/finance/cash/out/create/preview',
    name: 'finance.cash.out.create.preview',
    component: OutCreatePreview
  },
  {
    path: '/finance/cash/out/:id',
    name: 'finance.cash.out.show',
    component: OutShow
  }
]
