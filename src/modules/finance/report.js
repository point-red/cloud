import api from '@/api'

const url = '/finance/reports'

const state = {
  report: {
    form: {
      number: null
    },
    report_account: {
      label: null
    },
    details: []
  },
  reports: [],
  total: [],
  opening_balance: [],
  ending_balance: null,
  cash_advance: null,
  pagination: {
    last_page: null
  }
}

const getters = {
  report: state => {
    return state.report
  },
  reports: state => {
    return state.reports
  },
  total: state => {
    return state.total
  },
  opening_balance: state => {
    return state.opening_balance
  },
  ending_balance: state => {
    return state.ending_balance
  },
  cash_advance: state => {
    return state.cash_advance
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.reports = payload.data.data
    state.pagination.last_page = payload.data.last_page
    state.total = payload.total
    state.opening_balance = payload.opening_balance
    state.ending_balance = payload.ending_balance
    state.cash_advance = payload.cash_advance
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
