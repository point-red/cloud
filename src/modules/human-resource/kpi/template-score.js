import api from '@/api'

const url = '/human-resource/kpi/template-scores'

const state = {
  score: {},
  scores: []
}

const getters = {
  score: state => {
    return state.score
  },
  scores: state => {
    return state.scores
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.scores = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.score = payload
  },
  'CREATE' (state, payload) {
    state.score = payload
  },
  'UPDATE' (state, payload) {
    state.score = payload
  },
  'DELETE' (state, payload) {
    state.score = {}
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
                kpi_template_indicator_id: response.data.kpi_template_indicator_id
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
                kpi_template_indicator_id: response.data.kpi_template_indicator_id
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
                kpi_template_indicator_id: response.data.kpi_template_indicator_id
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
