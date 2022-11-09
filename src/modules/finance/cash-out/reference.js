// Import API
import api from '@/api'

// Initialize URL
const url = '/finance/payments/get-references'

// State
const state = {
  reference: {
    form: {
      number: null
    },
    details: []
  },
  references: [],
  pagination: {}
}

// Getter
const getters = {
  reference: (state) => {
    return state.reference
  },
  references: (state) => {
    return state.references
  },
  pagination: (state) => {
    return state.pagination
  }
}

// Mutations
const mutations = {
  FETCH_ARRAY (state, payload) {
    state.references = payload.data
    state.pagination = payload.meta
  },
  FETCH_OBJECT (state, payload) {
    state.reference = payload.data
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
