import api from '@/api'

const url = '/accounting/cut-off-account-receivables'

const state = {
  accountReceivable: {
    customer: {
      name: ''
    },
    notes: '',
    amount: 0
  },
  accountReceivables: []
}

const getters = {
  accountReceivable: state => {
    return state.accountReceivable
  },
  accountReceivables: state => {
    return state.accountReceivables
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.accountReceivables = payload.data
  },
  'FETCH_OBJECT' (state, payload) {
    state.accountReceivable = payload.data
  },
  'CREATE' (state, payload) {
    state.accountReceivable = payload
  },
  'UPDATE' (state, payload) {
    state.accountReceivable = payload
  },
  'DELETE' (state, payload) {
    state.accountReceivable = {}
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
