import BranchIndex from '@/views/master/branch/Index'
import BranchShow from '@/views/master/branch/Show'

export default [
  { path: '/master/branch', name: 'branch.index', component: BranchIndex },
  { path: '/master/branch/:id', name: 'branch.show', component: BranchShow }
]
