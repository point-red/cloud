import api from '@/api'

const url = '/manufacture/machines'

const state = {
  machine: {
    code: '',
    name: ''
  },
  machines: [],
  pagination: {},
  nextId: 1
}

const getters = {
  machine: state => {
    return state.machine
  },
  machines: state => {
    return state.machines
  },
  pagination: state => {
    return state.pagination
  },
  nextId: state => {
    return state.nextId
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.machines = payload.data
    state.pagination = payload.meta
    state.nextId = payload.next_id
  },
  'FETCH_OBJECT' (state, payload) {
    state.machine = payload.data
  },
  'CREATE' (state, payload) {
    state.machine = payload
  },
  'UPDATE' (state, payload) {
    state.machine = payload
  },
  'DELETE' (state, payload) {
    state.machine = {}
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
