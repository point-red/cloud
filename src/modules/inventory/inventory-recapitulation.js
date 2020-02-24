import api from '@/api'

const url = '/inventory/inventory-recapitulations'

const state = {
  inventory: {},
  inventories: [],
  warehouses: [],
  pagination: {},
  openingBalance: 0,
  openingBalanceCurrentPage: 0,
  stockIn: 0,
  stockOut: 0,
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
  stockOut: state => {
    return state.stockOut
  },
  endingBalance: state => {
    return state.endingBalance
  },
  inventories: state => {
    return state.inventories
  },
  warehouses: state => {
    return state.warehouses
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.inventories = payload.data
    state.pagination = payload.meta
  },
  'FETCH_WAREHOUSES' (state, payload) {
    state.warehouses = payload.data
    state.openingBalance = payload.opening_balance
    state.openingBalanceCurrentPage = payload.opening_balance_current_page
    state.stockIn = payload.stock_in
    state.stockOut = payload.stock_out
    state.endingBalance = payload.ending_balance
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.inventories = payload.data
    state.openingBalance = payload.opening_balance
    state.openingBalanceCurrentPage = payload.opening_balance_current_page
    state.stockIn = payload.stock_in
    state.stockOut = payload.stock_out
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
  getWarehouse ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id + '/warehouses', payload)
        .then(response => {
          commit('FETCH_WAREHOUSES', response)
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
