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
  pagination: {},
  salariesBy: {},
  additionalBy: {}
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
  pagination: state => {
    return state.pagination
  },
  salariesBy: state => {
    return state.salariesBy
  },
  additionalBy: state => {
    return state.additionalBy
  }
}

const mutations = {
  'FETCH_SALARIES' (state, payload) {
    state.salaries = payload.data
    state.pagination = payload.meta
  },
  'FETCH_SALARIES_BY' (state, payload) {
    state.salariesBy = payload
    state.additionalBy = payload.additional
  },
  'FETCH_SALARY' (state, payload) {
    state.salary = payload.data
    state.additional = payload.additional
  },
  'FETCH_SALARY_ASSESSMENT' (state, payload) {
    state.salaryAssessment = payload.data
  },
  'FETCH_SALARY_ACHIEVEMENT' (state, payload) {
    state.salaryAchievement = payload.data
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
  export ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url(payload.employeeId) + '/export', payload)
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
        .then(response => {
          commit('FETCH_SALARIES', response)
          dispatch('humanResourceEmployee/find', { id: payload.employeeId }, { root: true })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getAssessment ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.employeeId) + '/assessment', { params: payload.params })
        .then(response => {
          commit('FETCH_SALARY_ASSESSMENT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getAchievement ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.employeeId) + '/achievement', { params: payload.params })
        .then(response => {
          commit('FETCH_SALARY_ACHIEVEMENT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  find ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.employeeId) + '/' + payload.salaryId)
        .then(response => {
          commit('FETCH_SALARY', response)
          dispatch('humanResourceEmployee/find', { id: payload.employeeId }, { root: true })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  findBy ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api.get('/human-resource/employee/employees/' + payload.employeeId + '/salary-by/' + payload.value + '?type=' + payload.type)
        .then(response => {
          commit('FETCH_SALARIES_BY', response)
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
      api.patch(url(payload.employeeId) + '/' + payload.salaryId, payload.form)
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
          context.dispatch('find')
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
