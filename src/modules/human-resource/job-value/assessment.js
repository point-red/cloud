import api from '@/api'

const url = '/human-resource/job-value/assessment'

const state = {
  assessment: {
    period_from: null,
    period_to: null,
    status: 'draft',
    total_value: 0,
    total_score: 0,
    scores: []
  },
  assessments: [],
  assessmentList: [],
  pagination: {
    current_page: null,
    from: null,
    to: null,
    path: null,
    last_page: null,
    per_page: null,
    total: null
  },
  calculation: {}
}

const getters = {
  assessment: state => {
    return state.assessment
  },
  assessments: state => {
    return state.assessments
  },
  assessmentList: state => {
    return state.assessmentList
  },
  pagination: state => {
    return state.pagination
  },
  calculation: state => {
    return state.calculation
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.assessments = payload.data
    state.pagination.current_page = payload.meta.current_page
    state.pagination.from = payload.meta.from
    state.pagination.to = payload.meta.to
    state.pagination.path = payload.meta.path
    state.pagination.last_page = payload.meta.last_page
    state.pagination.per_page = payload.meta.per_page
    state.pagination.total = payload.meta.total
  },
  'FETCH_SELECT_LIST' (state, payload) {
    const array = []
    payload.forEach(element => {
      array.push({
        id: element.id,
        label: element.name
      })
    })
    state.assessmentList = array
  },
  'FETCH_OBJECT' (state, payload) {
    state.assessment = payload.data
  },
  'FETCH_CALCULATION_OBJECT' (state, payload) {
    state.calculation = payload.data
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
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          commit('FETCH_SELECT_LIST', response.data)
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
  findCalculation ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id + '/calculation', payload)
        .then(response => {
          commit('FETCH_CALCULATION_OBJECT', response)
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
  approve (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id + '/approve', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  reject (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id + '/reject', payload)
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
