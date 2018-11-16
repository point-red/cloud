import RoleIndex from './Index'
import RoleShow from './Show'
import RoleCreate from './Create'

export default [
  { path: '/master/role', name: 'RoleIndex', component: RoleIndex },
  { path: '/master/role/create', name: 'RoleCreate', component: RoleCreate },
  { path: '/master/role/:id', name: 'RoleShow', component: RoleShow }
]
