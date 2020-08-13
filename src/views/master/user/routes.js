import UserIndex from '@/views/master/user/Index'
import UserShow from '@/views/master/user/Show'

export default [
  { path: '/master/user', name: 'UserIndex', component: UserIndex },
  { path: '/master/user/:id', name: 'UserShow', component: UserShow }
]
