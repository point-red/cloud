import api from '@/api'

const url = function (employeeId) {
  return '/human-resource/employee/employees/' + employeeId + '/assessment'
}

const state = {
  assessment: {},
  assessments: [],
  dataSet: []
}

const getters = {
  assessment: state => {
    return state.assessment
  },
  assessments: state => {
    return state.assessments
  },
  dataSet: state => {
    return state.dataSet
  }
}

const mutations = {
  'FETCH_ASSESSMENTS' (state, payload) {
    state.assessments = payload
  },
  'FETCH_DATA_SET' (state, payload) {
    state.dataSet = payload
  },
  'FETCH_ASSESSMENT' (state, payload) {
    state.assessment = payload
  },
  'CREATE' (state, payload) {
    state.assessment = payload
  },
  'UPDATE' (state, payload) {
    state.assessment = payload
  },
  'DELETE' (state, payload) {
    state.assessment = {}
  }
}

const actions = {
  get ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.employeeId), { params: payload.params })
        .then(
          (response) => {
            commit('FETCH_ASSESSMENTS', response.data)
            commit('FETCH_DATA_SET', response.data_set)
            dispatch('Employee/find', { id: payload.employeeId }, { root: true })
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  find ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.employeeId) + '/' + payload.kpiId)
        .then(
          (response) => {
            commit('FETCH_ASSESSMENT', response.data)
            dispatch('Employee/find', { id: payload.employeeId }, { root: true })
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url(payload.employeeId), payload.form)
        .then(
          (response) => {
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
            context.dispatch('KpiTemplate/find', { id: response.data.kpi_template_id }, { root: true })
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  delete (context, payload) {
    return new Promise((resolve, reject) => {
      api.delete(url(payload.employeeId) + '/' + payload.id, payload)
        .then(
          (response) => {
            context.dispatch('get', {
              employeeId: response.data.employee.id
            })
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
