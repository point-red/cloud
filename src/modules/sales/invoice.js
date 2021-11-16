import api from '@/api/nodeServer'

const url = '/sales/invoices'

const state = {
  invoice: {
    amount: null,
    customer: {
      name: null,
      phone: null,
      email: null
    },
    discountValue: null,
    discountPercent: null,
    dueDate: null,
    form: {
      createdByUser: {},
      requestApprovalToUser: {}
    }
  },
  invoices: [],
  pagination: {}
}

const getters = {
  invoice: state => {
    return state.invoice
  },
  invoices: state => {
    return state.invoices
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.invoices = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    console.log(payload.data)
    payload.data.items.forEach(element => {
      element.more = false
    })
    state.invoice = payload.data
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        })
        .catch(error => {
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
      const bodyPayload = { reason: payload.reason || null }
      api.post(url + '/' + payload.id + '/reject', bodyPayload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  cancellationApprove (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/cancellation-approve')
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  cancellationReject (context, payload) {
    return new Promise((resolve, reject) => {
      const bodyPayload = { reason: payload.reason || null }
      api.post(url + '/' + payload.id + '/cancellation-reject', bodyPayload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  sendReport (context, payload) {
    const bodyPayload = { email: payload.email, message: payload.message || null }
    return new Promise((resolve, reject) => {
      api.post(`${url}/${payload.id}/send-invoice`, bodyPayload)
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
