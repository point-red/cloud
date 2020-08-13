import api from '@/api'

const url = '/accounting/journals'

const state = {
  journals: []
}

const getters = {
  journals: state => {
    return state.journals
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.journals = payload.data
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
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
