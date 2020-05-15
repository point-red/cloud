import api from '@/api'

const state = {
}

const getters = {
}

const mutations = {
}

const actions = {
  create ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post('/account/wallets/pay', payload)
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
