import api from '@/api'

const url = '/project/projects'

const state = {
  project: {},
  projects: []
}

const getters = {
  project: state => {
    return state.project
  },
  projects: state => {
    return state.projects
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.projects = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.project = payload
  },
  'CREATE' (state, payload) {
    state.project = payload
  },
  'UPDATE' (state, payload) {
    state.project = payload
  },
  'DELETE' (state, payload) {
    state.project = {}
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
  update ({ context, commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id, payload)
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
