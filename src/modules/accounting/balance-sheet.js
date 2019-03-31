import api from '@/api'

const url = '/accounting/balance-sheets'

const state = {
  chartOfAccount: {},
  chartOfAccounts: []
}

const getters = {
  chartOfAccount: state => {
    return state.chartOfAccount
  },
  chartOfAccounts: state => {
    return state.chartOfAccounts
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.chartOfAccounts = payload.data
  },
  'FETCH_OBJECT' (state, payload) {
    state.chartOfAccount = payload.data
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
  },
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id)
        .then(
          (response) => {
            commit('FETCH_OBJECT', response.data)
            resolve(response)
          },
          (error) => {
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
