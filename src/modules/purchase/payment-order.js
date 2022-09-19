import api from '@/api/nodeServer'

const url = '/purchase/payment-order'

const state = {
  purchasePaymentOrder: {
    date: null,
    customer_id: null,
    form: {
      number: null,
      notes: null,
      created_by: {
        name: null
      },
      request_approval_to: {
        full_name: null
      }
    },
    customer: {
      name: null
    },
    details: []
  },
  purchasePaymentOrders: [],
  pagination: {},
  references: {}
}

const getters = {
  purchasePaymentOrder: state => {
    return state.purchasePaymentOrder
  },
  purchasePaymentOrders: state => {
    console.log(state)
    return state.purchasePaymentOrders
  },
  pagination: state => {
    return state.pagination
  },
  references: state => {
    return state.references
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.purchasePaymentOrders = payload.data
    state.pagination = payload.meta
  },
  'FETCH_REFERENCES' (state, payload) {
    state.references = payload.data
  },
  'CREATE' (state, payload) {
    state.purchasePaymentOrder = payload
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
  getReferences ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(`${url}/reference/${payload.id}`)
        .then(response => {
          commit('FETCH_REFERENCES', response)
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
  approve (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(`${url}/${payload.id}/approve`)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  reject (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(`${url}/${payload.id}/reject`, { reason: payload.reason })
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
