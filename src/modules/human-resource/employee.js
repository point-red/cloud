import api from '@/api'

const url = '/human-resource/employee/employees'

const state = {
  employee: {},
  employees: [],
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
  employee: state => {
    return state.employee
  },
  employees: state => {
    return state.employees
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.employees = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.employee = payload.data
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
      api.get(url, payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id, payload)
        .then(response => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  assignAssessment (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.employee_id + '/assign-assessment', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  sendKpiReminder (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/kpi-reminder', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url, payload)
        .then(response => {
          context.dispatch('humanResourceKpiTemplate/find', { id: response.data.kpi_template_id }, { root: true })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  update (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id, payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  delete (context, payload) {
    return new Promise((resolve, reject) => {
      api.delete(url + '/' + payload.id, payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  bulkDelete ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/bulk-delete', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  archive ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id + '/archive', payload)
        .then(response => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  bulkArchive ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/bulk-archive', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  activate ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id + '/activate', payload)
        .then(response => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  bulkActivate ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/bulk-activate', payload)
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
