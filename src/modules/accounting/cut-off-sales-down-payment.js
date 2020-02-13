import api from '@/api'

const url = '/accounting/cut-off-sales-down-payments'

const state = {
  salesDownPayment: {
    customer: {
      name: ''
    },
    notes: '',
    amount: 0
  },
  salesDownPayments: []
}

const getters = {
  salesDownPayment: state => {
    return state.salesDownPayment
  },
  salesDownPayments: state => {
    return state.salesDownPayments
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.salesDownPayments = payload.data
  },
  'FETCH_OBJECT' (state, payload) {
    state.salesDownPayment = payload.data
  },
  'CREATE' (state, payload) {
    state.salesDownPayment = payload
  },
  'UPDATE' (state, payload) {
    state.salesDownPayment = payload
  },
  'DELETE' (state, payload) {
    state.salesDownPayment = {}
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
