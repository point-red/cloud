import api from '@/api'

const url = '/notifications'

const state = {
  notifications: [],
  pagination: {}
}

const getters = {
  notifications: state => {
    return state.notifications
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.notifications = payload.data
    state.pagination = payload.meta
  },
  'UPDATE' (state, payload) {
    state.branch = payload
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
  markAllAsRead ({ commit }) {
    return new Promise((resolve, reject) => {
      api.post(url + '/mark-all-as-read')
        .then(response => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  markAsRead ({ commit }, id) {
    return new Promise((resolve, reject) => {
      api.post(url + '/mark-as-read/' + id)
        .then(response => {
          commit('UPDATE', response.data)
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
