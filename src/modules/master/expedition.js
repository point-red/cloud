import api from '@/api'

const url = '/master/expeditions'

const state = {
  expedition: {
    name: '',
    email: '',
    address: '',
    phone: ''
  },
  expeditions: [],
  pagination: {}
}

const getters = {
  expedition: state => {
    return state.expedition
  },
  expeditions: state => {
    return state.expeditions
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.expeditions = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.expedition = payload.data
  },
  'CREATE' (state, payload) {
    state.expedition = payload
  },
  'UPDATE' (state, payload) {
    state.expedition = payload
  },
  'DELETE' (state, payload) {
    state.expedition = {}
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
