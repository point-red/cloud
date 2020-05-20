import api from '@/api'

const url = '/plugin/pin-point/report/performances'

const state = {
  reports: [],
  items: [],
  dataSet: []
}

const getters = {
  reports: state => {
    return state.reports
  },
  items: state => {
    return state.items
  },
  dataSet: state => {
    return state.dataSet
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.reports = payload.data.reports
    state.items = payload.data.items
    state.dataSet = payload.data_set
  }
}

const actions = {
  export ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/export', payload)
        .then((response) => {
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  },
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then((response) => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }, (error) => {
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
