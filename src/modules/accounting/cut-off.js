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
  cutOffAccounts: []
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
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.cutOffs = payload.data
  },
  'FETCH_ARRAY1' (state, payload) {
    state.cutOffAccounts = payload.data
  },
  'FETCH_OBJECT' (state, payload) {
    state.cutOff = payload.data
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
