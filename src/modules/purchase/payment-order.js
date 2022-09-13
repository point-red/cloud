import api from '@/api'

const url = '/purchase/request'

const state = {
  purchasePaymentOrder: {
    date: null
  },
  purchasePaymentOrders: [],
  pagination: {}
}

const getters = {
  purchasePaymentOrder: state => {
    return state.purchasePaymentOrder
  },
  purchasePaymentOrders: state => {
    return state.purchasePaymentOrders
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.purchasePaymentOrders = payload.data
    state.pagination = payload.meta
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
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
