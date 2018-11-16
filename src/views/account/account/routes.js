import AccountProfile from '@/views/account/account/Profile'
import AccountPassword from '@/views/account/account/Password'

export default [
  { path: '/account/profile', name: 'AccountProfile', component: AccountProfile },
  { path: '/account/profile/password', name: 'AccountPassword', component: AccountPassword }
]
