import api from '@/api/nodeServer'

const url = '/purchase/payment-order'

const state = {
  purchasePaymentOrder: {
    approval_reason: null,
    approval_status: null,
    approved_by: null,
    cancellation_approval_reason: null,
    cancellation_status: null,
    created_at: null,
    created_by: null,
    date: null,
    down_payment_collection: [],
    form_number: null,
    id: null,
    invoice_collection: [],
    notes: null,
    other_collection: null,
    payment_method: null,
    request_cancellation_reason: null,
    return_collection: [],
    supplier_address: null,
    supplier_name: null,
    supplier_phone: null,
    total_amount: null,
    total_down_payment: null,
    total_invoice: null,
    total_other: null,
    total_return: null,
    form: {}
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
  'FETCH_OBJECT' (state, payload) {
    payload.data.form = {
      approval_reason: 'Dummy',
      approval_status: -1
    }
    state.purchasePaymentOrder = payload.data
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
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(`${url}/${payload.id}`)
        .then(response => {
          commit('FETCH_OBJECT', response)
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
  },
  previewFormNumber ({ commit }) {
    return new Promise((resolve, reject) => {
      api.get(url + '/preview-form-number')
        .then((response) => {
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
