import axios from '@/axios'
import modules from './modules'
import Vue from 'vue'
import VueCookie from 'vue-cookie'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.use(VueCookie)

const store = new Vuex.Store({
  actions: {
    reloadVuex ({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        const accessToken = Vue.cookie.get('TAT')
        if (!accessToken) {
          return
        }

        const expirationDate = Vue.cookie.get('TED')
        const now = new Date()
        if (now >= expirationDate) {
          return
        }
        axios.defaults.headers.common.Authorization = Vue.cookie.get('TTT') + ' ' + Vue.cookie.get('TAT')
        commit('auth/storeUser', {})
        dispatch('accountRewardToken/get')
        commit('lang/updateLang', localStorage.getItem('locale') || 'en')
        state.uiHandler.openLeftSidebar = localStorage.getItem('openLeftSidebar') || true
        state.uiHandler.openSideOverlay = localStorage.getItem('openSideOverlay') || false
        state.uiHandler.isSidebarInverse = localStorage.getItem('isSidebarInverse') || true
        dispatch('auth/tryAutoLogin', {}, { root: true })
          .then(response => {
            return resolve(response)
          })
      })
    }
  },
  modules
})

Vue.store = store

export default store
