import api from '@/api'

const url = '/master/customers'

const state = {
  customer: {
    name: '',
    email: '',
    address: '',
    phone: ''
  },
  customers: []
}

const getters = {
  customer: state => {
    return state.customer
  },
  customers: state => {
    return state.customers
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.customers = payload
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
  get ({ commit }) {
    return new Promise((resolve, reject) => {
      api.get(url)
        .then(
          (response) => {
            commit('FETCH_ARRAY', response.data)
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
