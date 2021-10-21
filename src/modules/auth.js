import api from '@/api'

import Vue from 'vue'
import axios from '@/axios'
import axiosNode from '@/axiosNode'
import router from '@/router'
import device from 'mobile-device-detect'

const profileUrl = '/account/profiles'
const passwordUrl = '/account/password'
const resetPasswordRequestUrl = '/auth/reset-password-request'
const resetPasswordUrl = '/auth/reset-password'

const state = {
  accessToken: null,
  tokenType: null,
  expirationDate: null,
  user: null
}

const getters = {
  authUser: state => {
    return state.user
  }
}

const mutations = {
  authUser (state, userData) {
    state.accessToken = userData.accessToken
    state.tokenType = userData.tokenType
    state.expirationDate = userData.expirationDate
  },
  storeUser (state, user) {
    state.user = user
  },
  removeAuth (state) {
    state.accessToken = null
    state.tokenType = null
    state.expirationDate = null
    state.user = null
  }
}

const actions = {
  login ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      axios.post('/auth/login', {
        username: payload.username,
        password: payload.password,
        is_mobile: device.isMobile,
        os_name: device.osName,
        os_version: device.osVersion,
        browser_name: device.browserName,
        browser_version: device.browserVersion,
        mobile_vendor: device.mobileVendor,
        mobile_model: device.mobileModel,
        engine_name: device.engineName,
        engine_version: device.engineVersion
      }).then(response => {
        var axiosData = response.data // axios wrap response with data
        var apiData = axiosData.data
        commit('authUser', {
          accessToken: apiData.access_token,
          tokenId: apiData.token_id,
          tokenType: apiData.token_type,
          expirationDate: apiData.token_expires_at
        })
        if (process.env.NODE_ENV === 'development') {
          Vue.cookie.set('TID', apiData.token_id)
          Vue.cookie.set('TTT', apiData.token_type)
          Vue.cookie.set('TAT', apiData.access_token)
          Vue.cookie.set('TED', apiData.token_expires_at)
        } else {
          Vue.cookie.set('TID', apiData.token_id, { domain: '.' + process.env.VUE_APP_DOMAIN }, 30)
          Vue.cookie.set('TTT', apiData.token_type, { domain: '.' + process.env.VUE_APP_DOMAIN }, 30)
          Vue.cookie.set('TAT', apiData.access_token, { domain: '.' + process.env.VUE_APP_DOMAIN }, 30)
          Vue.cookie.set('TED', apiData.token_expires_at, { domain: '.' + process.env.VUE_APP_DOMAIN }, 30)
        }
        localStorage.setItem('userId', apiData.id)
        localStorage.setItem('userName', apiData.name)
        localStorage.setItem('userEmail', apiData.email)
        localStorage.setItem('fullName', apiData.full_name)
        localStorage.setItem('tenantCode', apiData.tenant_code)
        localStorage.setItem('tenantName', apiData.tenant_name)
        localStorage.setItem('tenantAddress', apiData.tenant_address)
        localStorage.setItem('tenantPhone', apiData.tenant_phone)
        commit('storeUser', apiData)
        axios.defaults.headers.common.Authorization = apiData.token_type + ' ' + apiData.access_token

        axiosNode.post('/auth/get-token', {
          accessToken: apiData.access_token,
          email: apiData.email,
          id: apiData.id
        }).then(({ data }) => {
          if (process.env.NODE_ENV === 'development') {
            Vue.cookie.set('TNAT', data.token)
          } else {
            Vue.cookie.set('TNAT', data.token, { domain: '.' + process.env.VUE_APP_DOMAIN }, 30)
          }
        }).catch(error => {})
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout () {
    if (process.env.NODE_ENV === 'development') {
      Vue.cookie.delete('TID')
      Vue.cookie.delete('TTT')
      Vue.cookie.delete('TAT')
      Vue.cookie.delete('TED')
    } else {
      Vue.cookie.delete('TID')
      Vue.cookie.delete('TTT')
      Vue.cookie.delete('TAT')
      Vue.cookie.delete('TED')
      Vue.cookie.delete('TID', { domain: '.' + process.env.VUE_APP_DOMAIN })
      Vue.cookie.delete('TTT', { domain: '.' + process.env.VUE_APP_DOMAIN })
      Vue.cookie.delete('TAT', { domain: '.' + process.env.VUE_APP_DOMAIN })
      Vue.cookie.delete('TED', { domain: '.' + process.env.VUE_APP_DOMAIN })
    }

    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPhone')
    localStorage.removeItem('userAddress')
    localStorage.removeItem('defaultWarehouse')
    router.replace('/auth/signin')
  },
  tryAutoLogin ({ commit }) {
    return new Promise((resolve, reject) => {
      const accessToken = Vue.cookie.get('TAT')
      if (!accessToken) {
        reject(new Error('Cannot verify access token'))
      }
      const expirationDate = Vue.cookie.get('TED')
      const now = new Date()
      if (now >= expirationDate) {
        reject(new Error('Access token expired'))
      }

      commit('authUser', {
        accessToken: accessToken,
        tokenId: Vue.cookie.get('TID'),
        tokenType: Vue.cookie.get('TTT'),
        expirationDate: Vue.cookie.get('TED')
      })

      axios.defaults.headers.common.Authorization = Vue.cookie.get('TTT') + ' ' + Vue.cookie.get('TAT')
      axios.post('/auth/fetch', {
        access_token: accessToken
      }).then((response) => {
        var axiosData = response.data // axios wrap response with data
        var apiData = axiosData.data
        localStorage.setItem('userId', apiData.id)
        localStorage.setItem('userName', apiData.name)
        localStorage.setItem('userEmail', apiData.email)
        localStorage.setItem('tenantCode', apiData.tenant_code)
        localStorage.setItem('tenantName', apiData.tenant_name)
        commit('storeUser', apiData)
        return resolve(response.data)
      }).catch(error => {
        // cannot auth, redirect to login page
        // router.replace('/auth/signin')
        return reject(error.data)
      })
    })
  },
  updateProfile (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(profileUrl + '/' + payload.id, payload)
        .then(response => {
          context.dispatch('tryAutoLogin')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  resetPasswordRequest (context, payload) {
    return new Promise((resolve, reject) => {
      api.get(resetPasswordRequestUrl, { params: payload })
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  resetPassword (context, payload) {
    return new Promise((resolve, reject) => {
      api.get(resetPasswordUrl, { params: payload })
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  updatePassword (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(passwordUrl + '/' + payload.id, payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
