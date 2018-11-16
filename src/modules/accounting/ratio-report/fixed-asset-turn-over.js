import api from '@/api'

const url = '/accounting/ratio-report/fixed-asset-turn-overs'

const state = {
  fixedAssetTurnOvers: []
}

const getters = {
  fixedAssetTurnOvers: state => {
    return state.fixedAssetTurnOvers
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.fixedAssetTurnOvers = payload
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
