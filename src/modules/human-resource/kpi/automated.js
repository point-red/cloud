import api from '@/api'

const url = '/human-resource/kpi/automated'

const state = {
  automated_codes: []
}

const getters = {
  automated_codes: state => {
    return state.automated_codes
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.automated_codes = payload
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, { params: payload })
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
