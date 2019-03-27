import api from '@/api'

const url = '/master/customers'

const state = {
  customer: {
    name: '',
    email: '',
    address: '',
    phone: ''
  },
  customers: [],
  pagination: {}
}

const getters = {
  customer: state => {
    return state.customer
  },
  customers: state => {
    return state.customers
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.customers = payload
  },
  'PAGINATION' (state, payload) {
    state.pagination = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.customer = payload
  },
  'CREATE' (state, payload) {
    state.customer = payload
  },
  'UPDATE' (state, payload) {
    state.customer = payload
  },
  'DELETE' (state, payload) {
    state.customer = {}
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
      api.get(url + '/' + payload.id, {
        params: payload.params
      }).then(response => {
        commit('FETCH_OBJECT', response.data)
        resolve(response)
      }).catch(error => {
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
