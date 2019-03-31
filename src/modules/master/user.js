import api from '@/api'

const url = '/master/users'

const state = {
  user: {
    name: '',
    email: '',
    address: '',
    phone: ''
  },
  users: [],
  pagination: {}
}

const getters = {
  user: state => {
    return state.user
  },
  users: state => {
    return state.users
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.users = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.user = payload
  },
  'CREATE' (state, payload) {
    state.user = payload
  },
  'UPDATE' (state, payload) {
    state.user = payload
  },
  'DELETE' (state, payload) {
    state.user = {}
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload).then(response => {
        commit('FETCH_ARRAY', response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id, payload).then(
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
