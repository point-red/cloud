import Vue from 'vue'
import Router from 'vue-router'
import GuestLayout from './views/layouts/GuestLayout.vue'
import AuthLayout from '@/views/layouts/AuthLayout'
import AccountLayout from '@/views/layouts/account/AccountLayout'
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
import Accounting from '@/views/accounting/routes'
import Account from '@/views/account/routes'
import Plugin from '@/views/plugin/routes'

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
        { path: 'signin', name: 'SignIn', component: () => import('./views/auth/SignIn.vue') },
        { path: 'forgot-password', name: 'ForgotPassword', component: () => import('./views/auth/ForgotPassword.vue') },
        { path: 'reset-password', name: 'ResetPassword', component: () => import('./views/auth/ResetPassword.vue') }
      ]
    },
    {
      path: '/account',
      component: AccountLayout,
      children: [
        { path: 'whoops', component: Whoops },
        ...Account
      ],
      beforeEnter: (to, from, next) => {
        // redirect to sign in page if not authenticated
        if (!store.state.Auth['user']) {
          if (Vue.cookie.get('TAT') !== null && Vue.cookie.get('TTT') !== null) {
            store.dispatch('reloadVuex')
            next()
          } else {
            next({ path: '/auth/signin', query: { r: to.fullPath } })
            return
          }
        }
        // redirect to account route if host is not tenant subdomain
        if (window.location.host !== process.env.VUE_APP_DOMAIN) {
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: '/', name: 'Dashboard', component: Dashboard },
        { path: '/menu', name: 'MainMenu', component: MainMenu },
        { path: '/whoops', component: Whoops },
        ...Master,
        ...HumanResource,
        ...Purchase,
        ...Accounting,
        ...Plugin
      ],
      beforeEnter: (to, from, next) => {
        // redirect to sign in page if not authenticated
        if (!store.state.Auth['user']) {
          if (Vue.cookie.get('TAT') !== null) {
            store.dispatch('reloadVuex')
            next()
          } else {
            next({ path: '/auth/signin', query: { r: to.fullPath } })
            return
          }
        }
        // redirect to account route if host is not tenant subdomain
        if (window.location.host == process.env.VUE_APP_DOMAIN) {
          next('/account')
        } else {
          next()
        }
      }
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
