import api from '@/api'

const state = {
  invoice_url: 0
}

const getters = {
  invoice_url: state => {
    return state.invoice_url
  }
}

const mutations = {
  'FETCH_URL' (state, payload) {
    state.invoice_url = payload
  }
}

const actions = {
  create ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post('/account/wallets/top-up', payload)
        .then(response => {
          commit('FETCH_URL', response.data.invoice_url)
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
