import AccountMenu from '@/views/account/Index'
import Referral from '@/views/account/Referral'
import EmailSubscription from '@/views/account/EmailSubscription'
import Notification from '@/views/account/Notification'
import Account from './account/routes'
import Project from './project/routes'
import Billing from './billing/routes'
import Reward from './reward/routes'

export default [
  { path: '/account', name: 'account.menu', component: AccountMenu },
  { path: '/account/referral', name: 'referral', component: Referral },
  { path: '/account/email-subscription', name: 'email.subscription', component: EmailSubscription },
  { path: '/account/notification', name: 'notification', component: Notification },
  ...Account,
  ...Project,
  ...Billing,
  ...Reward
]
