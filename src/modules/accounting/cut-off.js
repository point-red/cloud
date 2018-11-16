import api from '@/api'

const url = '/accounting/cut-offs'

const state = {
  cutOff: {},
  cutOffs: []
}

const getters = {
  cutOff: state => {
    return state.cutOff
  },
  cutOffs: state => {
    return state.cutOffs
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.cutOffs = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.cutOff = payload
  },
  'CREATE' (state, payload) {
    state.cutOff = payload
  },
  'UPDATE' (state, payload) {
    state.cutOff = payload
  },
  'DELETE' (state, payload) {
    state.cutOff = {}
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
