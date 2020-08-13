import api from '@/api'

const url = '/accounting/cut-off-purchase-down-payments'

const state = {
  purchaseDownPayment: {
    supplier: {
      name: ''
    },
    notes: '',
    amount: 0
  },
  purchaseDownPayments: []
}

const getters = {
  purchaseDownPayment: state => {
    return state.purchaseDownPayment
  },
  purchaseDownPayments: state => {
    return state.purchaseDownPayments
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.purchaseDownPayments = payload.data
  },
  'FETCH_OBJECT' (state, payload) {
    state.purchaseDownPayment = payload.data
  },
  'CREATE' (state, payload) {
    state.purchaseDownPayment = payload
  },
  'UPDATE' (state, payload) {
    state.purchaseDownPayment = payload
  },
  'DELETE' (state, payload) {
    state.purchaseDownPayment = {}
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
