import api from '@/api'

const url = '/finance/cash-advances'

const state = {
  cashAdvance: {
    form: {
      number: null,
      created_by: {
        name: null
      },
      request_approval_to: {
        full_name: null
      }
    }
  },
  cashAdvances: [],
  histories: [],
  pagination: {}
}

const getters = {
  cashAdvance: state => {
    return state.cashAdvance
  },
  cashAdvances: state => {
    return state.cashAdvances
  },
  histories: state => {
    return state.histories
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.cashAdvances = payload.data
    state.pagination = payload.meta
  },
  'FETCH_HISTORY' (state, payload) {
    state.histories = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.cashAdvance = payload.data
  },
  'CREATE' (state, payload) {
    state.cashAdvance = payload
  },
  'UPDATE' (state, payload) {
    state.cashAdvance = payload
  },
  'DELETE' (state, payload) {
    state.cashAdvance = {}
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
  history ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/history', payload)
        .then(response => {
          commit('FETCH_HISTORY', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  storeHistory (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/history', payload)
        .then(response => {
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
  refund (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/refund', payload)
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
  sendBulkRequestApproval (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/send-bulk-request-approval', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  bulkApproval (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/bulk-approval', payload)
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
