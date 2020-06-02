import api from '@/api'

const url = '/plugins'

const state = {
  plugin: {},
  plugins: [],
  pagination: {}
}

const getters = {
  plugin: state => {
    return state.plugin
  },
  plugins: state => {
    return state.plugins
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.plugins = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.plugin = payload.data
  },
  'CREATE' (state, payload) {
    state.plugin = payload
  },
  'UPDATE' (state, payload) {
    state.plugin = payload
  },
  'DELETE' (state, payload) {
    state.plugin = {}
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
  update ({ context, commit }, payload) {
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
  subscribe ({ context, commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/subscribe', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  unsubscribe ({ context, commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/unsubscribe', payload)
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
