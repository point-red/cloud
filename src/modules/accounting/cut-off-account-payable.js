import api from '@/api'

const url = '/accounting/cut-off-account-payables'

const state = {
  accountPayable: {
    supplier: {
      name: ''
    },
    notes: '',
    amount: 0
  },
  accountPayables: []
}

const getters = {
  accountPayable: state => {
    return state.accountPayable
  },
  accountPayables: state => {
    return state.accountPayables
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.accountPayables = payload.data
  },
  'FETCH_OBJECT' (state, payload) {
    state.accountPayable = payload.data
  },
  'CREATE' (state, payload) {
    state.accountPayable = payload
  },
  'UPDATE' (state, payload) {
    state.accountPayable = payload
  },
  'DELETE' (state, payload) {
    state.accountPayable = {}
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
