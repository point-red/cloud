import AllocationGroupIndex from '@/views/master/allocation-group/Index'
import AllocationGroupCreate from '@/views/master/allocation-group/Create'
import AllocationGroupShow from '@/views/master/allocation-group/Show'
import AllocationGroupEdit from '@/views/master/allocation-group/Edit'

export default [
  { path: '/master/allocation-group', name: 'allocation-group.index', component: AllocationGroupIndex },
  { path: '/master/allocation-group/create', name: 'allocation-group.create', component: AllocationGroupCreate },
  { path: '/master/allocation-group/:id', name: 'allocation-group.show', component: AllocationGroupShow },
  { path: '/master/allocation-group/:id/edit', name: 'allocation-group.edit', component: AllocationGroupEdit }
]
