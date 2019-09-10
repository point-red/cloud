import api from '@/api'

const url = function (employeeId) {
  return '/human-resource/employee/employees/' + employeeId + '/salary'
}

const state = {
  salary: {},
  additional: {},
  salaryAssessment: {},
  salaryAchievement: {},
  salaries: [],
  dataSet: []
}

const getters = {
  salary: state => {
    return state.salary
  },
  additional: state => {
    return state.additional
  },
  salaryAssessment: state => {
    return state.salaryAssessment
  },
  salaryAchievement: state => {
    return state.salaryAchievement
  },
  salaries: state => {
    return state.salaries
  },
  dataSet: state => {
    return state.dataSet
  }
}

const mutations = {
  'FETCH_SALARIES' (state, payload) {
    state.salaries = payload
  },
  'FETCH_DATA_SET' (state, payload) {
    state.dataSet = payload
  },
  'FETCH_SALARY' (state, payload) {
    state.salary = payload
  },
  'FETCH_SALARY_ADDITIONAL' (state, payload) {
    state.additional = payload
  },
  'FETCH_SALARY_ASSESSMENT' (state, payload) {
    state.salaryAssessment = payload
  },
  'FETCH_SALARY_ACHIEVEMENT' (state, payload) {
    state.salaryAchievement = payload
  },
  'CREATE' (state, payload) {
    state.salary = payload
  },
  'UPDATE' (state, payload) {
    state.salary = payload
  },
  'DELETE' (state, payload) {
    state.salary = {}
  }
}

const actions = {
  exportPDF ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url(payload.employeeId) + '/export/pdf', payload)
        .then((response) => {
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  },
  exportExcel ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url(payload.employeeId) + '/export/excel', payload)
        .then((response) => {
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  },
  get ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.employeeId), { params: payload.params })
        .then(
          (response) => {
            commit('FETCH_SALARIES', response.data)
            commit('FETCH_DATA_SET', response.data_set)
            dispatch('humanResourceEmployee/find', { id: payload.employeeId }, { root: true })
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  getAssessment ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.employeeId) + '/assessment', { params: payload.params })
        .then(
          (response) => {
            commit('FETCH_SALARY_ASSESSMENT', response.data)
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  getAchievement ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.employeeId) + '/achievement', { params: payload.params })
        .then(
          (response) => {
            commit('FETCH_SALARY_ACHIEVEMENT', response.data)
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  find ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.employeeId) + '/' + payload.salaryId)
        .then(
          (response) => {
            commit('FETCH_SALARY', response.data)
            commit('FETCH_SALARY_ADDITIONAL', response.additional)
            dispatch('humanResourceEmployee/find', { id: payload.employeeId }, { root: true })
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
      api.patch(url(payload.employeeId) + '/' + payload.salaryId, payload.form)
        .then(
          (response) => {
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
