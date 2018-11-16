import api from '@/api'

const url = '/accounting/ratio-report/working-capital-turn-overs'

const state = {
  workingCapitalTurnOvers: []
}

const getters = {
  workingCapitalTurnOvers: state => {
    return state.workingCapitalTurnOvers
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.workingCapitalTurnOvers = payload
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
