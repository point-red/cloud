import api from '@/api'

const url = '/inventory/inventory-warehouse-currentstock'

const state = {
  inventories: [],
  stock: 0
}

const getters = {
  inventories: state => {
    return state.inventories
  },
  stock: state => {
    return state.stock
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.inventories = payload.data
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
