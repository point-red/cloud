import api from '@/api'

const url = '/master/branches'

const state = {
  branch: {
    name: ''
  },
  branches: [],
  pagination: {}
}

const getters = {
  branch: state => {
    return state.branch
  },
  branches: state => {
    return state.branches
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.branches = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.branch = payload.data
  },
  'CREATE' (state, payload) {
    state.branch = payload
  },
  'UPDATE' (state, payload) {
    state.branch = payload
  },
  'DELETE' (state, payload) {
    state.branch = {}
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
