import UserIndex from '@/views/master/user/Index'
import UserCreate from '@/views/master/user/Create'
import UserShow from '@/views/master/user/Show'
import UserEdit from '@/views/master/user/Edit'

export default [
  { path: '/master/user', name: 'UserIndex', component: UserIndex },
  { path: '/master/user/create', name: 'UserCreate', component: UserCreate },
  { path: '/master/user/:id', name: 'UserShow', component: UserShow },
  { path: '/master/user/:id/edit', name: 'UserEdit', component: UserEdit }
]
