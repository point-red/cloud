import Master from '@/views/master/Index'
import User from './user/routes'
import Role from './role/routes'

export default [
  { path: '/master', name: 'Master', component: Master },
  ...User,
  ...Role
]
