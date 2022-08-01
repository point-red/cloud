import api from '@/api'

const url = '/sales/approval/payment-collection'

const state = {
  salesPaymentCollections: [],
  pagination: {}
}

const getters = {
  salesPaymentCollections: state => {
    return state.salesPaymentCollections
  },
  allSalesPaymentCollections: (state, getters) => (salesPaymentCollections) => {
    let results = []

    salesPaymentCollections.forEach(salesPaymentCollection => {
      const subs = [...salesPaymentCollection.salesPaymentCollections]
      delete salesPaymentCollection.salesPaymentCollections

      results.push(salesPaymentCollection)
      results = results.concat(getters.allsalesPaymentCollections(subs))
    })

    return results
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  SET_SALESPAYMENTCOLLECTION (state, salesPaymentCollections) {
    state.salesPaymentCollections = salesPaymentCollections
  },
  SET_PAGINATION (state, pagination) {
    state.pagination = pagination
  }
}

const actions = {
  async send ({ commit }, payload) {
    return api.post(`${url}/send`, payload)
  },
  async sendSingle ({ commit }, payload) {
    return api.post(`${url}/${payload.id}/send`, payload)
  },
  async sendCancellation ({ commit }, payload) {
    return api.post(`${url}/cancellation/${payload.id}/send`, payload)
  },
  async get ({ commit, state }, payload) {
    const { data, meta } = await api.get(url, payload)

    commit('SET_SALESPAYMENTCOLLECTION', data)
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
