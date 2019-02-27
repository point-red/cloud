import Master from '@/views/master/Index'
import User from './user/routes'
import Role from './role/routes'
import Customer from './customer/routes'

export default [
  { path: '/master', name: 'Master', component: Master },
  ...User,
  ...Role,
  ...Customer
]
