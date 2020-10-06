import api from '@/api'

const url = '/plugin/salary-non-sales/employee-fee'

const state = {
  employeFee: {
    id: null,
    employee_id: null,
    fee: null,
    score: null,
    start_period: null,
    end_period: null,
    criterias: []
  },
  employeFees: [],
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
  employeeFees: state => {
    return state.employeFees
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.employeFees = payload.data
    state.pagination = payload.meta
  }
}

const actions = {
  get ({ commit }, payload) {
    console.log('get -> payload', payload)
    return new Promise((resolve, reject) => {
      api.get(url + '?employee_id=' + payload.employee_id, payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  save ({ commit }, payload) {
    return api.post(url, payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
