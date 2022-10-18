import api from '@/api'

const url = '/sales/return/approval'

const state = {
  salesReturns: [],
  pagination: {}
}

const getters = {
  salesReturns: state => {
    return state.salesReturns
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  SET_DELIVERY_ORDERS (state, salesReturns) {
    state.salesReturns = salesReturns
  },
  SET_PAGINATION (state, pagination) {
    state.pagination = pagination
  }
}

const actions = {
  async send ({ commit }, payload) {
    return api.post(`${url}/send`, payload)
  },
  async get ({ commit, state }, payload) {
    const { data, meta } = await api.get(url, payload)

    commit('SET_DELIVERY_ORDERS', data)
    commit('SET_PAGINATION', meta)
  },
  async approve ({ commit }, id) {
    return api.post(`${url}/${id}/approve`)
  },
  async decline ({ commit }, payload) {
    return api.post(`${url}/${payload.id}/decline`, payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
