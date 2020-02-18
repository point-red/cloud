import RoleIndex from './Index'
import RoleCreate from './Create'
import RoleShow from './Show'
import RoleEdit from './Edit'

export default [
  { path: '/master/role', name: 'role.index', component: RoleIndex },
  { path: '/master/role/create', name: 'role.create', component: RoleCreate },
  { path: '/master/role/:id', name: 'role.show', component: RoleShow },
  { path: '/master/role/:id/edit', name: 'role.edit', component: RoleEdit }
]
