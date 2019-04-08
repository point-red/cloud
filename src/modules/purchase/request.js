import api from '@/api'

const url = '/purchase/requests'

const state = {
  purchaseRequest: {
    date: null,
    required_date: null,
    supplier_id: null,
    employee_id: null,
    allocation_id: null,
    form: {
      number: null
    },
    employee: {
      name: null
    },
    supplier: {
      name: null
    }
  },
  purchaseRequests: [],
  pagination: {}
}

const getters = {
  purchaseRequest: state => {
    return state.purchaseRequest
  },
  purchaseRequests: state => {
    return state.purchaseRequests
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.purchaseRequests = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.purchaseRequest = payload.data
  },
  'CREATE' (state, payload) {
    state.purchaseRequest = payload
  },
  'UPDATE' (state, payload) {
    state.purchaseRequest = payload
  },
  'DELETE' (state, payload) {
    state.purchaseRequest = {}
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