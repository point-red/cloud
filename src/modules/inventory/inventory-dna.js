import api from '@/api'

const url = '/inventory/inventory-dna'

const state = {
  inventories: [],
  pagination: {}
}

const getters = {
  inventories: state => {
    return state.inventories
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.inventories = payload.data
    state.pagination = payload.meta
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.itemId, payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getAll ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.itemId + '/all', payload)
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
