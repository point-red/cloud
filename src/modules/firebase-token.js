import api from '@/api'

const url = '/firebase-token'

const state = {
  firebaseToken: {},
  firebaseTokens: []
}

const getters = {
  firebaseToken: state => {
    return state.firebaseToken
  },
  firebaseTokens: state => {
    return state.firebaseTokens
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.firebaseTokens = payload.data
  },
  'FETCH_OBJECT' (state, payload) {
    state.firebaseToken = payload.data
  },
  'CREATE' (state, payload) {
    state.firebaseToken = payload
  },
  'UPDATE' (state, payload) {
    state.firebaseToken = payload
  },
  'DELETE' (state, payload) {
    state.firebaseToken = {}
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
