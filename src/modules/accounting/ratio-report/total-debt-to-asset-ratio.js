import api from '@/api'

const url = '/accounting/ratio-report/total-debt-to-asset-ratios'

const state = {
  totalDebtToAssetRatios: []
}

const getters = {
  totalDebtToAssetRatios: state => {
    return state.totalDebtToAssetRatios
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.totalDebtToAssetRatios = payload
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
