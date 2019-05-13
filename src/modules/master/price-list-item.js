import api from '@/api'

const url = '/master/price-list-items'

const state = {
  item: {
    code: '',
    name: ''
  },
  items: [],
  groups: [],
  pagination: {}
}

const getters = {
  item: state => {
    return state.item
  },
  items: state => {
    return state.items
  },
  groups: state => {
    return state.groups
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.items = payload.data.price_lists
    state.groups = payload.data.groups
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.item = payload.data
  },
  'CREATE' (state, payload) {
    state.item = payload
  },
  'UPDATE' (state, payload) {
    state.item = payload
  },
  'DELETE' (state, payload) {
    state.item = {}
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
