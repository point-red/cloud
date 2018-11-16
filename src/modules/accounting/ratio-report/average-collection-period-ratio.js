import api from '@/api'

const url = '/accounting/ratio-report/average-collection-period-ratios'

const state = {
  averageCollectionPeriodRatios: []
}

const getters = {
  averageCollectionPeriodRatios: state => {
    return state.averageCollectionPeriodRatios
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.averageCollectionPeriodRatios = payload
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
