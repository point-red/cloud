import api from '@/api'

const url = '/inventory/inventories'

const state = {
  inventory: {},
  inventories: [],
  pagination: {},
  openingBalance: 0,
  openingBalanceCurrentPage: 0,
  stockIn: 0,
  stockInCurrentPage: 0,
  stockOut: 0,
  stockOutCurrentPage: 0,
  endingBalance: 0
}

const getters = {
  inventory: state => {
    return state.inventory
  },
  openingBalance: state => {
    return state.openingBalance
  },
  openingBalanceCurrentPage: state => {
    return state.openingBalanceCurrentPage
  },
  stockIn: state => {
    return state.stockIn
  },
  stockInCurrentPage: state => {
    return state.stockInCurrentPage
  },
  stockOut: state => {
    return state.stockOut
  },
  stockOutCurrentPage: state => {
    return state.stockOutCurrentPage
  },
  endingBalance: state => {
    return state.endingBalance
  },
  inventories: state => {
    return state.inventories
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.inventories = payload.data
    state.openingBalance = payload.opening_balance
    state.openingBalanceCurrentPage = payload.opening_balance_current_page
    state.stockIn = payload.stock_in
    state.stockInCurrentPage = payload.stock_in_current_page
    state.stockOut = payload.stock_out
    state.stockOutCurrentPage = payload.stock_out_current_page
    state.endingBalance = payload.ending_balance
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.inventories = payload.data
    state.openingBalance = payload.opening_balance
    state.openingBalanceCurrentPage = payload.opening_balance_current_page
    state.stockIn = payload.stock_in
    state.stockInCurrentPage = payload.stock_in_current_page
    state.stockOut = payload.stock_out
    state.stockOutCurrentPage = payload.stock_out_current_page
    state.endingBalance = payload.ending_balance
    state.pagination = payload.meta
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
      api.get(url + '/' + payload.itemId, payload)
        .then(response => {
          commit('FETCH_OBJECT', response)
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
