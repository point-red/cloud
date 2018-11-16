import api from '@/api'

const url = '/accounting/ratio-report/acid-test-ratios'

const state = {
  currentRatio: []
}

const getters = {
  currentRatio: state => {
    return state.currentRatio
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.currentRatio = payload
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, {
        params: payload
      })
        .then(
          (response) => {
            commit('FETCH_ARRAY', response.data)
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
