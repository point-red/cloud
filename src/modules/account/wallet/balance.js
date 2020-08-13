import api from '@/api'

const state = {
  amount: 0
}

const getters = {
  amount: state => {
    return state.amount
  }
}

const mutations = {
  'FETCH_AMOUNT' (state, payload) {
    state.amount = payload
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get('/account/wallets/amount', payload)
        .then(response => {
          commit('FETCH_AMOUNT', response.data.amount)
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
