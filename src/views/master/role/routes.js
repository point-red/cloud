import RoleIndex from './Index'
import RoleShow from './Show'

export default [
  { path: '/master/role', name: 'role.index', component: RoleIndex },
  { path: '/master/role/:id', name: 'role.show', component: RoleShow }
]
