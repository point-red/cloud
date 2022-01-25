import api from '@/api'

const url = '/master/fixed-assets/depreciation-methods'

const state = {
  depreciationMethod: {},
  depreciationMethods: []
}

const getters = {
  depreciationMethod: state => {
    return state.depreciationMethod
  },
  depreciationMethods: state => {
    return state.depreciationMethods
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.depreciationMethods = payload
  }
}

const actions = {
  get ({ commit }) {
    return new Promise((resolve, reject) => {
      api.get(url)
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
