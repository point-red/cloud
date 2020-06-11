import api from '@/api'

const url = '/accounting/chart-of-account-sub-ledgers'

const state = {
  chartOfAccountSubLedger: {},
  chartOfAccountSubLedgers: [],
  chartOfAccountSubLedgerList: []
}

const getters = {
  chartOfAccountSubLedger: state => {
    return state.chartOfAccountSubLedger
  },
  chartOfAccountSubLedgerList: state => {
    return state.chartOfAccountSubLedgerList
  },
  chartOfAccountSubLedgers: state => {
    return state.chartOfAccountSubLedgers
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.chartOfAccountSubLedgers = payload.data
  },
  'FETCH_SELECT_LIST' (state, payload) {
    const array = []
    payload.data.forEach(element => {
      array.push({
        id: element.id,
        label: element.alias
      })
    })
    state.chartOfAccountSubLedgerList = array
  },
  'FETCH_OBJECT' (state, payload) {
    state.chartOfAccountSubLedger = payload.data
  },
  'CREATE' (state, payload) {
    state.chartOfAccountSubLedger = payload
  },
  'UPDATE' (state, payload) {
    state.chartOfAccountSubLedger = payload
  },
  'DELETE' (state, payload) {
    state.chartOfAccountSubLedger = {}
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          commit('FETCH_SELECT_LIST', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id, payload)
        .then(response => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url, payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  update (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id, payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  delete (context, payload) {
    return new Promise((resolve, reject) => {
      api.delete(url + '/' + payload.id, payload)
        .then(response => {
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
