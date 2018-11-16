import api from '@/api'

const url = '/human-resource/kpi/templates'

const state = {
  template: {},
  templates: [],
  pagination: {
    current_page: null,
    from: null,
    to: null,
    path: null,
    last_page: null,
    per_page: null,
    total: null
  }
}

const getters = {
  template: state => {
    return state.template
  },
  templates: state => {
    return state.templates
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.templates = payload.data
    state.pagination.current_page = payload.meta.current_page
    state.pagination.from = payload.meta.from
    state.pagination.to = payload.meta.to
    state.pagination.path = payload.meta.path
    state.pagination.last_page = payload.meta.last_page
    state.pagination.per_page = payload.meta.per_page
    state.pagination.total = payload.meta.total
  },
  'FETCH_OBJECT' (state, payload) {
    state.template = payload
  },
  'CREATE' (state, payload) {
    state.template = payload
  },
  'UPDATE' (state, payload) {
    state.template = payload
  },
  'DELETE' (state, payload) {
    state.template = {}
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, { params: payload }).then((response) => {
        commit('FETCH_ARRAY', response)
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
