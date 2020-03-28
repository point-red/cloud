import AllocationGroupIndex from '@/views/master/allocation-group/Index'
import AllocationGroupShow from '@/views/master/allocation-group/Show'

export default [
  { path: '/master/allocation-group', name: 'allocation-group.index', component: AllocationGroupIndex },
  { path: '/master/allocation-group/:id', name: 'allocation-group.show', component: AllocationGroupShow }
]
