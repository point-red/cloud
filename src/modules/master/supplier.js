import api from '@/api'

const url = '/master/suppliers'

const state = {
  supplier: {
    name: '',
    email: '',
    address: '',
    phone: ''
  },
  suppliers: []
}

const getters = {
  supplier: state => {
    return state.supplier
  },
  suppliers: state => {
    return state.suppliers
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.suppliers = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.supplier = payload
  },
  'CREATE' (state, payload) {
    state.supplier = payload
  },
  'UPDATE' (state, payload) {
    state.supplier = payload
  },
  'DELETE' (state, payload) {
    state.supplier = {}
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
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
