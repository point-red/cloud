import api from '@/api'

const url = '/accounting/ratio-report/rate-of-return-investment'

const state = {
  ratios: []
}

const getters = {
  ratios: state => {
    return state.ratios
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.ratios = payload
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
