import AccountMenu from '@/views/account/Index'
import Referral from '@/views/account/Referral'
import EmailSubscription from '@/views/account/EmailSubscription'
import Account from './account/routes'
import Project from './project/routes'
import Billing from './billing/routes'

export default [
  { path: '/account', name: 'AccountMenu', component: AccountMenu },
  { path: '/account/referral', name: 'Referral', component: Referral },
  { path: '/account/email-subscription', name: 'EmailSubscription', component: EmailSubscription },
  ...Account,
  ...Project,
  ...Billing
]
