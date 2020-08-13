import api from '@/api'

const url = '/purchase/invoices'

const state = {
  purchaseInvoice: {
    form: {},
    supplier: {}
  },
  purchaseInvoices: [],
  pagination: {}
}

const getters = {
  purchaseInvoice: state => {
    return state.purchaseInvoice
  },
  purchaseInvoices: state => {
    return state.purchaseInvoices
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.purchaseInvoices = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.purchaseInvoice = payload.data
  },
  'CREATE' (state, payload) {
    state.purchaseInvoice = payload
  },
  'UPDATE' (state, payload) {
    state.purchaseInvoice = payload
  },
  'DELETE' (state, payload) {
    state.purchaseInvoice = {}
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
  },
  approve (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/approve', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  reject (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/reject', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  cancellationApprove (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/cancellation-approve', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  cancellationReject (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/cancellation-reject', payload)
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
