import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import bugsnag from 'bugsnag-js'
import bugsnagVue from 'bugsnag-vue'
import swal from './lib/sweetalert2'
import Notifications from 'vue-notification'
import VueI18n from 'vue-i18n'
import i18n from './lang/lang'
import VueSlimScroll from 'vue-slimscroll'
import VueCookie from 'vue-cookie'
import PointAlert from '@/components/point-alert'
import PointDate from '@/components/point-date'
import PointFocus from '@/components/point-focus'
import PointFilter from '@/components/point-filter'
import PointNotification from '@/components/point-notification'
import PointNumber from '@/components/point-number'
import PointMask from '@/components/point-mask'
import PointPermission from '@/components/point-permission'
import PointRolePermission from '@/components/point-permission/role-permission'
import PointFormRules from '@/components/point-form-rules'
import PointTemplate from '@/components/point-template'
import VueTour from 'vue-tour'
import BlockUI from 'vue-blockui'
import VueClipboard from 'vue-clipboard2'
import VueSelectMenu from 'v-selectmenu'
import ClickOutside from 'v-click-outside'
import '@/firebase'

require('vue-tour/dist/vue-tour.css')
require('flag-icon-css/css/flag-icon.min.css')

if (process.env.VUA_APP_NODE_ENV == 'production') {
  const bugsnagClient = bugsnag(process.env.VUE_APP_BUGSNAG_API_KEY)
  bugsnagClient.use(bugsnagVue(Vue))
}

Vue.use(VueSelectMenu, { language: 'en' })
Vue.use(VueClipboard)
Vue.use(ClickOutside)
Vue.use(BlockUI)
Vue.use(Vuex)
Vue.use(VueTour)
Vue.use(VueCookie)
Vue.use(swal)
Vue.use(Notifications)
Vue.use(VueI18n)
Vue.use(VueSlimScroll)
Vue.use(PointAlert)
Vue.use(PointDate)
Vue.use(PointFocus)
Vue.use(PointFilter)
Vue.use(PointNotification)
Vue.use(PointNumber)
Vue.use(PointMask)
Vue.use(PointPermission)
Vue.use(PointRolePermission)
Vue.use(PointFormRules)
Vue.use(PointTemplate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
