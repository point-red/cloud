import AccountMenu from '@/views/account/Index'
import Billing from '@/views/account/Billing'
import Referral from '@/views/account/Referral'
import EmailSubscription from '@/views/account/EmailSubscription'
import account from './account/routes'
import project from './project/routes'

export default [
  { path: '/account', name: 'AccountMenu', component: AccountMenu },
  { path: '/account/billing', name: 'Billing', component: Billing },
  { path: '/account/referral', name: 'Referral', component: Referral },
  { path: '/account/email-subscription', name: 'EmailSubscription', component: EmailSubscription },
  ...account,
  ...project
]
