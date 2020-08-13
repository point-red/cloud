import api from '@/api'

const url = '/pos/bill'

const state = {
  bill: {
    date: null,
    form: {
      number: ''
    },
    customer: {
      name: null
    }
  },
  bills: [],
  pagination: {}
}

const getters = {
  bill: state => {
    return state.bill
  },
  bills: state => {
    return state.bills
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.bills = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.bill = payload.data
  },
  'CREATE' (state, payload) {
    state.bill = payload
  },
  'UPDATE' (state, payload) {
    state.bill = payload
  },
  'DELETE' (state, payload) {
    state.bill = {}
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
