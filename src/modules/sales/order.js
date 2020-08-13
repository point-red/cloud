import api from '@/api'

const url = '/sales/orders'

const state = {
  salesOrder: {
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
    items: []
  },
  salesOrders: [],
  pagination: {}
}

const getters = {
  salesOrder: state => {
    return state.salesOrder
  },
  salesOrders: state => {
    return state.salesOrders
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.salesOrders = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    payload.data.items.forEach(element => {
      element.more = false
    })
    state.salesOrder = payload.data
  },
  'CREATE' (state, payload) {
    state.salesOrder = payload
  },
  'UPDATE' (state, payload) {
    state.salesOrder = payload
  },
  'DELETE' (state, payload) {
    state.salesOrder = {}
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
