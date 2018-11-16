import api from '@/api'

const url = '/accounting/ratio-report/inventory-turn-overs'

const state = {
  inventoryTurnOvers: []
}

const getters = {
  inventoryTurnOvers: state => {
    return state.inventoryTurnOvers
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.inventoryTurnOvers = payload
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
