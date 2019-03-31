import api from '@/api'

const url = '/human-resource/kpi/template-groups'

const state = {
  group: {},
  groups: []
}

const getters = {
  group: state => {
    return state.group
  },
  groups: state => {
    return state.groups
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.groups = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.group = payload
  },
  'CREATE' (state, payload) {
    state.group = payload
  },
  'UPDATE' (state, payload) {
    state.group = payload
  },
  'DELETE' (state, payload) {
    state.group = {}
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
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
            context.dispatch('get', {
              params: {
                kpi_template_id: response.data.kpi_template_id
              }
            })
            context.dispatch('humanResourceKpiTemplate/find', { id: response.data.kpi_template_id }, { root: true })
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
            context.dispatch('get', {
              params: {
                kpi_template_id: response.data.kpi_template_id
              }
            })
            context.dispatch('humanResourceKpiTemplate/find', { id: response.data.kpi_template_id }, { root: true })
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
            context.dispatch('get', {
              params: {
                kpi_template_id: response.data.kpi_template_id
              }
            })
            context.dispatch('humanResourceKpiTemplate/find', { id: response.data.kpi_template_id }, { root: true })
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
