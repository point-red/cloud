import api from '@/api'

const url = '/master/user-invitations'

const state = {
  userInvitation: {},
  userInvitations: [],
  pagination: {}
}

const getters = {
  userInvitation: state => {
    return state.userInvitation
  },
  userInvitations: state => {
    return state.userInvitations
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.userInvitations = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.userInvitation = payload.data
  },
  'CREATE' (state, payload) {
    state.userInvitation = payload
  },
  'UPDATE' (state, payload) {
    state.userInvitation = payload
  },
  'DELETE' (state, payload) {
    state.userInvitation = {}
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
