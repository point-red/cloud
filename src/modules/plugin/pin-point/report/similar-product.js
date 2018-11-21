import api from '@/api'

const url = '/plugin/pin-point/report/accumulation/similar-products'

const state = {
  products: [],
  totalPerWeek: []
}

const getters = {
  products: state => {
    return state.products
  },
  totalPerWeek: state => {
    return state.totalPerWeek
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.products = payload.products
    state.totalPerWeek = payload.totalPerWeek
  }
}

const actions = {
  export ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/export', payload)
        .then((response) => {
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  },
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then((response) => {
          commit('FETCH_ARRAY', response.data)
          resolve(response)
        }, (error) => {
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
