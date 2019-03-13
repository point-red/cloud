import api from '@/api'

const url = '/accounting/chart-of-accounts'

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
    state.chartOfAccount = payload
  },
  'CREATE' (state, payload) {
    state.chartOfAccount = payload
  },
  'UPDATE' (state, payload) {
    state.chartOfAccount = payload
  },
  'DELETE' (state, payload) {
    state.chartOfAccount = {}
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then(
          (response) => {
            commit('FETCH_ARRAY', response)
            resolve(response)
          },
          (error) => {
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
  },
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url, payload)
        .then(
          (response) => {
            context.dispatch('get')
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  update (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id, payload)
        .then(
          (response) => {
            context.dispatch('get')
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  delete (context, payload) {
    return new Promise((resolve, reject) => {
      api.delete(url + '/' + payload.id, payload)
        .then(
          (response) => {
            context.dispatch('get')
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
