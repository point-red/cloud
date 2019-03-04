import AllocationIndex from '@/views/master/allocation/Index'
import AllocationCreate from '@/views/master/allocation/Create'
import AllocationShow from '@/views/master/allocation/Show'
import AllocationEdit from '@/views/master/allocation/Edit'

export default [
  { path: '/master/allocation', name: 'allocation.index', component: AllocationIndex },
  { path: '/master/allocation/create', name: 'allocation.create', component: AllocationCreate },
  { path: '/master/allocation/:id', name: 'allocation.show', component: AllocationShow },
  { path: '/master/allocation/:id/edit', name: 'allocation.edit', component: AllocationEdit }
]
