import api from '@/api'

const url = '/purchase/requests'

const state = {
  purchaseRequest: {
    date: null,
    required_date: null,
    supplier_id: null,
    employee_id: null,
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
  purchaseRequestPagination: {}
}

const getters = {
  purchaseRequest: state => {
    return state.purchaseRequest
  },
  purchaseRequests: state => {
    return state.purchaseRequests
  },
  purchaseRequestPagination: state => {
    return state.purchaseRequestPagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.purchaseRequests = payload
  },
  'PAGINATION' (state, payload) {
    state.purchaseRequestPagination = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.purchaseRequest = payload
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
        .then(
          (response) => {
            commit('FETCH_ARRAY', response.data)
            commit('PAGINATION', response.meta)
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id)
        .then(
          (response) => {
            commit('FETCH_OBJECT', response.data)
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url, payload)
        .then(
          (response) => {
            context.dispatch('get')
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  update (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id, payload)
        .then(
          (response) => {
            context.dispatch('get')
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  delete (context, payload) {
    return new Promise((resolve, reject) => {
      api.delete(url + '/' + payload.id, payload)
        .then(
          (response) => {
            context.dispatch('get')
            resolve(response)
          },
          (error) => {
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
