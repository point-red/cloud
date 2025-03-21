import api from '@/api'

const url = '/human-resource/job-value/criteria'

const state = {
  criteria: {
    category: '',
    criteria_factor: '',
    total_score: null,
    scales: []
  },
  criterias: [],
  criteriaList: [],
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
  criteria: state => {
    return state.criteria
  },
  criterias: state => {
    return state.criterias
  },
  criteriaList: state => {
    return state.criteriaList
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.criterias = payload.data
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
    state.criteriaList = array
  },
  'FETCH_OBJECT' (state, payload) {
    state.criteria = payload.data
  },
  'CREATE' (state, payload) {
    state.criteria = payload
  },
  'UPDATE' (state, payload) {
    state.criteria = payload
  },
  'DELETE' (state, payload) {
    state.criteria = {}
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
      api.get(url + '/' + payload.id)
        .then(response => {
          commit('FETCH_OBJECT', response)
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
