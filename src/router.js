import Vue from 'vue'
import Router from 'vue-router'
import GuestLayout from './views/layouts/GuestLayout.vue'
import AuthLayout from '@/views/layouts/AuthLayout'
import AccountLayout from '@/views/layouts/account/AccountLayout'
import Approval from '@/views/Approval.vue'
// Authentication Pages
import E404 from '@/views/error/404'
import E503 from '@/views/error/503'
// App Pages
import Whoops from '@/views/error/Whoops'
import Dashboard from '@/views/Dashboard'
import MainMenu from '@/views/MainMenu'
import Master from '@/views/master/routes'
import HumanResource from '@/views/human-resource/routes'
import Purchase from '@/views/purchase/routes'
import Sales from '@/views/sales/routes'
import Inventory from '@/views/inventory/routes'
import Manufacture from '@/views/manufacture/routes'
import POS from '@/views/pos/routes'
import Finance from '@/views/finance/routes'
import Accounting from '@/views/accounting/routes'
import Account from '@/views/account/routes'
import Plugin from '@/views/plugin/routes'
import Setting from '@/views/setting/routes'

import store from '@/store'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      name: 'signin',
      component: GuestLayout,
      children: [
        { path: 'signin', name: 'sign-in', component: () => import('./views/auth/SignIn.vue') },
        { path: 'forgot-password', name: 'forgot-password', component: () => import('./views/auth/ForgotPassword.vue') },
        { path: 'reset-password', name: 'reset-password', component: () => import('./views/auth/ResetPassword.vue') }
      ]
    },
    {
      path: '/account',
      component: AccountLayout,
      children: [
        { path: 'whoops', component: Whoops },
        { path: 'storage', name: 'storage', component: () => import('./views/Storage.vue') },
        ...Account
      ],
      beforeEnter: (to, from, next) => {
        // redirect to sign in page if not authenticated
        if (!store.state.auth.user) {
          if (Vue.cookie.get('TAT') !== null && Vue.cookie.get('TTT') !== null) {
            store.dispatch('reloadVuex')
              .then(response => {
                next()
              }).catch(error => {
                console.log(error)
                next('/503')
              })
            next()
          } else {
            next({ path: '/auth/signin', query: { r: to.fullPath } })
          }
        } else {
          // redirect to account route if host is not tenant subdomain
          if (window.location.host !== process.env.VUE_APP_DOMAIN) {
            next('/')
          } else {
            next()
          }
        }
      }
    },
    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: '/', name: 'dashboard', component: Dashboard },
        { path: '/menu', name: 'main-menu', component: MainMenu },
        { path: '/storage', name: 'tenant-storage', component: () => import('./views/TenantStorage.vue') },
        { path: '/whoops', component: Whoops },
        ...Master,
        ...HumanResource,
        ...Purchase,
        ...Sales,
        ...Inventory,
        ...Manufacture,
        ...POS,
        ...Finance,
        ...Accounting,
        ...Plugin,
        ...Setting
      ],
      beforeEnter: (to, from, next) => {
        // redirect to sign in page if not authenticated
        if (!store.state.auth.user) {
          if (Vue.cookie.get('TAT') !== null) {
            store.dispatch('reloadVuex')
              .then(response => {
                if (window.location.host === process.env.VUE_APP_DOMAIN) {
                  next('/account')
                } else {
                  next()
                }
              }).catch(error => {
                console.log(error)
                next('/503')
              })
          } else {
            next({ path: '/auth/signin', query: { r: to.fullPath } })
          }
        } else {
          // redirect to account route if host is not tenant subdomain
          if (window.location.host === process.env.VUE_APP_DOMAIN) {
            next('/account')
          } else {
            next()
          }
        }
      }
    },
    {
      path: '/approval',
      component: Approval
    },
    {
      path: '/404',
      component: E404
    },
    {
      path: '/503',
      component: E503
    },
    {
      path: '*',
      beforeEnter: (to, from, next) => {
        next('/')
      }
    }
  ]
})
