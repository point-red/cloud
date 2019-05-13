import api from '@/api'

const url = '/master/user-roles'

const state = {
  userRole: {},
  userRoles: []
}

const getters = {
  userRole: state => {
    return state.userRole
  },
  userRoles: state => {
    return state.userRoles
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.userRoles = payload.data
  },
  'FETCH_OBJECT' (state, payload) {
    state.userRole = payload.data
  },
  'CREATE' (state, payload) {
    state.userRole = payload
  },
  'UPDATE' (state, payload) {
    state.userRole = payload
  },
  'DELETE' (state, payload) {
    state.userRole = {}
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
