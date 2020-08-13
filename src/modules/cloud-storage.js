import api from '@/api'

const url = '/storage'

const state = {
  cloudStorage: {},
  cloudStorages: [],
  pagination: {}
}

const getters = {
  cloudStorage: state => {
    return state.cloudStorage
  },
  cloudStorages: state => {
    return state.cloudStorages
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.cloudStorages = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.cloudStorage = payload.data
  },
  'CREATE' (state, payload) {
    state.cloudStorage = payload
  },
  'UPDATE' (state, payload) {
    state.cloudStorage = payload
  },
  'DELETE' (state, payload) {
    state.cloudStorage = {}
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
  },
  upload (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/upload', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
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
