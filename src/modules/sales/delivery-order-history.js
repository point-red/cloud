import api from '@/api'

const url = '/sales/delivery-orders'

const state = {
  deliveryOrderHistories: [],
  pagination: {}
}

const getters = {
  deliveryOrderHistories: state => {
    return state.deliveryOrderHistories
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.deliveryOrderHistories = payload.data
    state.pagination = payload.meta
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id + '/histories', payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  add (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/histories', payload)
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
