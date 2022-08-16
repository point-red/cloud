import api from '@/api'

const url = '/sales/payment-collection'

const state = {
  salesPaymentCollection: {
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
  salesPaymentCollections: [],
  historySalesPaymentCollections: [],
  references: {},
  pagination: {}
}

const getters = {
  salesPaymentCollection: state => {
    return state.salesPaymentCollection
  },
  salesPaymentCollections: state => {
    return state.salesPaymentCollections
  },
  pagination: state => {
    return state.pagination
  },
  references: state => {
    return state.references
  },
  historySalesPaymentCollections: state => {
    return state.historySalesPaymentCollections
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.salesPaymentCollections = payload.data
    state.historySalesPaymentCollections = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    payload.data.details.forEach(element => {
      element.more = false
    })
    state.salesPaymentCollection = payload.data
  },
  'CREATE' (state, payload) {
    state.salesPaymentCollection = payload
  },
  'UPDATE' (state, payload) {
    state.salesPaymentCollection = payload
  },
  'DELETE' (state, payload) {
    state.salesPaymentCollection = {}
  },
  'FETCH_REFERENCES' (state, payload) {
    state.references = payload.data
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
  getReferences ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id + '/references', payload)
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
  },
  addHistories (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/histories', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getHistories ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id + '/histories', payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  export ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/export', payload)
        .then((response) => {
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  },
  generateFormNumber ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/generate-number', payload)
        .then((response) => {
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  },
  approveByEmail (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/approve', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  rejectByEmail (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/reject', payload)
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
