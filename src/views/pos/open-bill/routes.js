import OpenBillIndex from '@/views/pos/open-bill/Index'
import OpenBillCreate from '@/views/pos/open-bill/Create'
import OpenBillShow from '@/views/pos/open-bill/Show'
import OpenBillEdit from '@/views/pos/open-bill/Edit'

export default [
  { path: '/pos/open-bill', name: 'pos.open-bill.index', component: OpenBillIndex },
  { path: '/pos/open-bill/create', name: 'pos.open-bill.create', component: OpenBillCreate },
  { path: '/pos/open-bill/:id', name: 'pos.open-bill.show', component: OpenBillShow },
  { path: '/pos/open-bill/:id/edit', name: 'pos.open-bill.edit', component: OpenBillEdit }
]
