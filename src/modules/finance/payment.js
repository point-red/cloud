// Import API
import api from '@/api'

// Initialize URL
const url = '/finance/approval/payments'

// State
const state = {
  payment: {
    form: {
      number: null
    },
    payment_account: {
      label: null
    },
    details: [],
    cash_advance: {
      amount: null,
      cash_advance: {
        amount: 0,
        amount_remaining: 0,
        form: {
          number: null,
          notes: null,
          done: false
        }
      }
    }
  },
  payments: [],
  pagination: {}
}

// Getter
const getters = {
  payment: (state) => {
    return state.payment
  },
  payments: (state) => {
    return state.payments
  },
  pagination: (state) => {
    return state.pagination
  }
}

// Mutations
const mutations = {
  FETCH_ARRAY (state, payload) {
    state.payments = payload.data
    state.pagination = payload.meta
  },
  FETCH_OBJECT (state, payload) {
    payload.data.items.forEach((element) => {
      element.more = false
    })
    state.payment = payload.data
  },
  CREATE (state, payload) {
    state.payment = payload
  },
  UPDATE (state, payload) {
    state.payment = payload
  },
  DELETE (state, payload) {
    state.payment = {}
  }
}

// Action
const actions = {
  // Get Data
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .get(url, payload)
        .then((response) => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // Find Data
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .get(url + '/' + payload.id, payload)
        .then((response) => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // Create Data
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api
        .post(url, payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // Update Data
  update (context, payload) {
    return new Promise((resolve, reject) => {
      api
        .patch(url + '/' + payload.id, payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // Delete Data
  delete (context, payload) {
    return new Promise((resolve, reject) => {
      api
        .delete(url + '/' + payload.id, payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // Cancel Approve Data
  cancellationApprove (context, payload) {
    return new Promise((resolve, reject) => {
      api
        .post(url + '/' + payload.id + '/cancellation-approve', payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // Cancel Reject Data
  cancellationReject (context, payload) {
    return new Promise((resolve, reject) => {
      api
        .post(url + '/' + payload.id + '/cancellation-reject', payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // Cancel Approve Data by Email
  approveByEmail (context, payload) {
    return new Promise((resolve, reject) => {
      api
        .post(url + '/approve', payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // Cancel Reject Data by Email
  rejectByEmail (context, payload) {
    return new Promise((resolve, reject) => {
      api
        .post(url + '/reject', payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

// Export Vuex
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
