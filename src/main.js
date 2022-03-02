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
import VueCookie from 'vue-cookie'
import PointAlert from '@/components/point-alert'
import PointDate from '@/components/point-date'
import PointFocus from '@/components/point-focus'
import PointFilter from '@/components/point-filter'
import PointNotification from '@/components/point-notification'
import PointNumber from '@/components/point-number'
import PointMask from '@/components/point-mask'
import PointPermission from '@/components/point-permission'
import PointPlugin from '@/components/point-plugin'
import PointRolePermission from '@/components/point-permission/role-permission'
import PointFormRules from '@/components/point-form-rules'
import PointTemplate from '@/components/point-template'
import VueTour from 'vue-tour'
import BlockUI from 'vue-blockui'
import VueClipboard from 'vue-clipboard2'
import VueSelectMenu from 'v-selectmenu'
import ClickOutside from 'v-click-outside'
import '@/firebase'
import PackageVersion from '@/components/package-version'
import VScrollLock from 'v-scroll-lock'
import SweetModal from 'sweet-modal-vue/src/plugin.js'
import sanitizeHTML from 'sanitize-html'
import * as GmapVue from 'gmap-vue'
import vars from './modules/common-vars'

Vue.use(SweetModal)
Vue.use(VScrollLock)

Vue.use(GmapVue, {
  load: {
    key: process.env.VUE_APP_GMAP_KEY,
    libraries: 'places' // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    /// / If you want to set the version, you can do so:
    // v: '3.26',
  },

  /// / If you intend to programmatically custom event listener code
  /// / (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  /// / instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  /// / you might need to turn this on.
  // autobindAllEvents: false,

  /// / If you want to manually install components, e.g.
  /// / import {GmapMarker} from 'gmap-vue/src/components/marker'
  /// / Vue.component('GmapMarker', GmapMarker)
  /// / then set installComponents to 'false'.
  /// / If you want to automatically install all the components this property must be set to 'true':
  installComponents: true
})

require('vue-tour/dist/vue-tour.css')

if (process.env.VUA_APP_NODE_ENV == 'production') {
  const bugsnagClient = bugsnag(process.env.VUE_APP_BUGSNAG_API_KEY)
  bugsnagClient.use(bugsnagVue(Vue))
}

Vue.use(PackageVersion)
Vue.use(PointDate)
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
Vue.use(PointAlert)
Vue.use(PointFocus)
Vue.use(PointFilter)
Vue.use(PointNotification)
Vue.use(PointNumber)
Vue.use(PointMask)
Vue.use(PointPermission)
Vue.use(PointPlugin)
Vue.use(PointRolePermission)
Vue.use(PointFormRules)
Vue.use(PointTemplate)

Vue.prototype.$sanitize = sanitizeHTML
Vue.prototype.$vars = vars

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
