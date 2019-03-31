import api from '@/api'

const url = function (roleId) {
  return '/master/roles/' + roleId + '/permissions'
}

const state = {
  permission: {},
  permissions: []
}

const getters = {
  permission: state => {
    return state.permission
  },
  permissions: state => {
    return state.permissions
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.permissions = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.permission = payload
  },
  'UPDATE' (state, payload) {
    state.permission = payload
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.id), payload)
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
      api.patch(url(payload.role_id), payload)
        .then(response => {
          context.dispatch('get', { id: payload.role_id })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  bulkUpdate (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url(payload.role_id) + '/bulk-update', payload)
        .then(response => {
          context.dispatch('get', { id: payload.role_id })
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
