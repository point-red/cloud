import api from '@/api'

const url = '/database/tables'

const state = {
  tables: [],
  rows: []
}

const getters = {
  tables: state => {
    return state.tables
  },
  rows: state => {
    return state.rows
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.tables = payload.data
  },
  'FETCH_ROWS' (state, payload) {
    state.rows = payload.data
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, {
        params: payload.params
      }).then(response => {
        commit('FETCH_ARRAY', response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  show ({ commit }, payload) {
    console.log(payload)
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.params.table_name, {
        params: payload.params
      }).then(response => {
        commit('FETCH_ROWS', response)
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
