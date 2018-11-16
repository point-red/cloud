import api from '@/api'

const url = '/accounting/ratio-report/total-asset-turn-overs'

const state = {
  totalAssetTurnOvers: []
}

const getters = {
  totalAssetTurnOvers: state => {
    return state.totalAssetTurnOvers
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.totalAssetTurnOvers = payload
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
