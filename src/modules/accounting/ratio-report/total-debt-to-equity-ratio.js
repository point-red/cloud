import api from '@/api'

const url = '/accounting/ratio-report/total-debt-to-equity-ratios'

const state = {
  totalDebtToEquityRatios: []
}

const getters = {
  totalDebtToEquityRatios: state => {
    return state.totalDebtToEquityRatios
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.totalDebtToEquityRatios = payload
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
