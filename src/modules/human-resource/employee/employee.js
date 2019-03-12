import api from '@/api'

const url = '/human-resource/employee/employees'

const state = {
  employee: {},
  employees: [],
  employeePagination: {
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
  employee: state => {
    return state.employee
  },
  employees: state => {
    return state.employees
  },
  employeePagination: state => {
    return state.employeePagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.employees = payload.data
    state.employeePagination.current_page = payload.meta.current_page
    state.employeePagination.from = payload.meta.from
    state.employeePagination.to = payload.meta.to
    state.employeePagination.path = payload.meta.path
    state.employeePagination.last_page = payload.meta.last_page
    state.employeePagination.per_page = payload.meta.per_page
    state.employeePagination.total = payload.meta.total
  },
  'FETCH_OBJECT' (state, payload) {
    state.employee = payload
  },
  'CREATE' (state, payload) {
    state.employee = payload
  },
  'UPDATE' (state, payload) {
    state.employee = payload
  },
  'DELETE' (state, payload) {
    state.employee = {}
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, {
        params: payload
      }).then((response) => {
        commit('FETCH_ARRAY', response)
        commit('EmployeeGroup/FETCH_ARRAY', response.additional.groups, { root: true })
        commit('EmployeeGroup/FETCH_SELECT_LIST', response.additional.groups, { root: true })
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  },
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id, {
        params: payload.params
      }).then((response) => {
        commit('FETCH_OBJECT', response.data)
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  },
  assignAssessment (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.employee_id + '/assign-assessment', payload)
        .then((response) => {
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  },
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url, payload)
        .then(
          (response) => {
            context.dispatch('KpiTemplate/find', { id: response.data.kpi_template_id }, { root: true })
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
