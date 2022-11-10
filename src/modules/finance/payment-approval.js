import api from '@/api'

const url = '/sales/approval/payment-collection'

const state = {
  payments: [],
  pagination: {}
}

const getters = {
  payments: (state) => {
    return state.payments
  },
  allpayments: (state, getters) => (payments) => {
    let results = []

    payments.forEach((payment) => {
      const subs = [...payment.payments]
      delete payment.payments

      results.push(payment)
      results = results.concat(getters.allpayments(subs))
    })

    return results
  },
  pagination: (state) => {
    return state.pagination
  }
}

const mutations = {
  SET_PAYMENT (state, payments) {
    state.payments = payments
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

    commit('SET_PAYMENT', data)
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
