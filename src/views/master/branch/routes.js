import BranchIndex from '@/views/master/branch/Index'
import BranchCreate from '@/views/master/branch/Create'
import BranchShow from '@/views/master/branch/Show'
import BranchEdit from '@/views/master/branch/Edit'

export default [
  { path: '/master/branch', name: 'branch.index', component: BranchIndex },
  { path: '/master/branch/create', name: 'branch.create', component: BranchCreate },
  { path: '/master/branch/:id', name: 'branch.show', component: BranchShow },
  { path: '/master/branch/:id/edit', name: 'branch.edit', component: BranchEdit }
]
