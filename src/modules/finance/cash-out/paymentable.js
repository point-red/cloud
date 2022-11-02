// Import API
import api from '@/api'

// Initialize URL
const url = '/finance/payments/get-paymentables'

// State
const state = {
  paymentable: {},
  paymentables: [],
  pagination: {}
}

// Getter
const getters = {
  paymentable: (state) => {
    return state.paymentable
  },
  paymentables: (state) => {
    return state.paymentables
  },
  pagination: (state) => {
    return state.pagination
  }
}

// Mutations
const mutations = {
  FETCH_ARRAY (state, payload) {
    state.paymentables = payload.data
    state.pagination = payload.meta
  },
  FETCH_OBJECT (state, payload) {
    state.paymentable = payload.data
  }
}

// Action
const actions = {
  // Get Data
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .get(url, payload)
        .then((response) => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // Find Data
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .get(url + '/' + payload.id, payload)
        .then((response) => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

// Export Vuex
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
