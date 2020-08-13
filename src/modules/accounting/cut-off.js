import api from '@/api'

const url = '/accounting/cut-offs'

const state = {
  cutOff: {
    form: {
      number: null,
      notes: null,
      created_by: {
        full_name: null
      }
    },
    approvers: [{
      requested_to: {
        full_name: null
      }
    }]
  },
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
    state.cutOffs = payload.data
  },
  'FETCH_OBJECT' (state, payload) {
    state.cutOff = payload.data
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
