import api from '@/api'

const url = '/human-resource/kpi/template-indicators'

const state = {
  indicator: {},
  indicators: []
}

const getters = {
  indicator: state => {
    return state.indicator
  },
  indicators: state => {
    return state.indicators
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.indicators = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.indicator = payload
  },
  'CREATE' (state, payload) {
    state.indicator = payload
  },
  'UPDATE' (state, payload) {
    state.indicator = payload
  },
  'DELETE' (state, payload) {
    state.indicator = {}
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
                kpi_template_group_id: response.data.kpi_template_group_id
              }
            })
            context.dispatch('humanResourceKpiTemplate/find', { id: payload.kpi_template_id }, { root: true })
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
                kpi_template_group_id: response.data.kpi_template_group_id
              }
            })
            context.dispatch('humanResourceKpiTemplate/find', { id: payload.kpi_template_id }, { root: true })
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
                kpi_template_group_id: response.data.kpi_template_group_id
              }
            })
            context.dispatch('humanResourceKpiTemplate/find', { id: response.data.group.kpi_template_id }, { root: true })
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
