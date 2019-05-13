import api from '@/api'

const url = '/accounting/journals'

const state = {
  journal: {},
  journals: []
}

const getters = {
  journal: state => {
    return state.journal
  },
  journals: state => {
    return state.journals
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.journals = payload.data
  },
  'FETCH_OBJECT' (state, payload) {
    state.journal = payload.data
  },
  'CREATE' (state, payload) {
    state.journal = payload
  },
  'UPDATE' (state, payload) {
    state.journal = payload
  },
  'DELETE' (state, payload) {
    state.journal = {}
  }
}

const actions = {
  get ({ commit }) {
    return new Promise((resolve, reject) => {
      api.get(url)
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
      api.get(url + '/' + payload.id)
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
