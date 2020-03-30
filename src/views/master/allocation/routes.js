import AllocationIndex from '@/views/master/allocation/Index'
import AllocationShow from '@/views/master/allocation/Show'

export default [
  { path: '/master/allocation', name: 'allocation.index', component: AllocationIndex },
  { path: '/master/allocation/:id', name: 'allocation.show', component: AllocationShow }
]
