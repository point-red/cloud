import api from '@/api'

const url = function (employeeId) {
  return '/human-resource/employee/employees/' + employeeId + '/assessment'
}

const state = {
  assessment: {},
  assessments: [],
  pagination: {},
  assessmentsBy: [],
  dataSet: []
}

const getters = {
  assessment: state => {
    return state.assessment
  },
  assessments: state => {
    return state.assessments
  },
  pagination: state => {
    return state.pagination
  },
  assessmentsBy: state => {
    return state.assessmentsBy
  },
  dataSet: state => {
    return state.dataSet
  }
}

const mutations = {
  'FETCH_ASSESSMENTS' (state, payload) {
    state.assessments = payload.data
    state.pagination = payload.meta
    state.dataSet = payload.data_set
  },
  'FETCH_ASSESSMENTS_BY' (state, payload) {
    state.assessmentsBy = payload
  },
  'FETCH_ASSESSMENT' (state, payload) {
    state.assessment = payload.data
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
      api.get(url(payload.employeeId), payload)
        .then(response => {
          commit('FETCH_ASSESSMENTS', response)
          dispatch('humanResourceEmployee/find', { id: payload.employeeId }, { root: true })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  find ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.employeeId) + '/' + payload.kpiId)
        .then(response => {
          commit('FETCH_ASSESSMENT', response)
          dispatch('humanResourceEmployee/find', { id: payload.employeeId }, { root: true })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  findBy ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api.get('/human-resource/employee/employees/' + payload.employeeId + '/assessment-by/' + payload.value + '?type=' + payload.type)
        .then(response => {
          commit('FETCH_ASSESSMENTS_BY', response)
          dispatch('humanResourceEmployee/find', { id: payload.employeeId }, { root: true })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url(payload.employeeId), payload.form)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  update (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url(payload.employeeId) + '/' + payload.kpiId, payload.form)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  delete (context, payload) {
    return new Promise((resolve, reject) => {
      api.delete(url(payload.employeeId) + '/' + payload.id, payload)
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
