import api from '@/api'

const url = '/accounting/cut-offs'

const state = {
  cutOff: {
    alias: null,
    number: null,
    credit: 0,
    debit: 0,
    id: null
  },
  cutOffs: [],
  cutOffAccounts: [],
  pagination: {},
  total: {
    debit: 0,
    credit: 0
  },
  download: null
}

const getters = {
  cutOff: state => {
    return state.cutOff
  },
  cutOffs: state => {
    return state.cutOffs
  },
  cutOffAccounts: state => {
    return state.cutOffAccounts
  },
  total: state => {
    return state.total
  },
  download: state => {
    return state.download
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.cutOffs = payload.data
    state.pagination = payload.meta
  },
  'FETCH_ARRAY1' (state, payload) {
    state.cutOffAccounts = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.cutOff = payload.data
  },
  'FETCH_TOTAL' (state, payload) {
    state.total = payload
  },
  'DOWNLOAD' (state, payload) {
    state.download = payload
  },
  'CREATE' (state, payload) {
    state.cutOff = payload
  },
  'UPDATE' (state, payload) {
    state.cutOff = payload
  },
  'DELETE' (state, payload) {
    state.cutOff = {}
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
  },
  getByAccount ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/account', payload)
        .then(response => {
          commit('FETCH_ARRAY1', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getDownload ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/account', payload)
        .then(response => {
          commit('DOWNLOAD', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getTotal ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/total', payload)
        .then(response => {
          commit('FETCH_TOTAL', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/account/' + payload.id, payload)
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
