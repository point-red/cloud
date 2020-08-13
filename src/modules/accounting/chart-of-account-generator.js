import api from '@/api'

const url = '/accounting/chart-of-account-generators'

const state = {
}

const getters = {
}

const mutations = {
  'CREATE' (state, payload) {
    state.chartOfAccount = payload
  }
}

const actions = {
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url, payload)
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
