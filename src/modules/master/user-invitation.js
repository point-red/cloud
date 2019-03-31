import api from '@/api'

const url = '/master/user-invitations'

const state = {
  userInvitation: {},
  userInvitations: []
}

const getters = {
  userInvitation: state => {
    return state.userInvitation
  },
  userInvitations: state => {
    return state.userInvitations
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.userInvitations = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.userInvitation = payload
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
