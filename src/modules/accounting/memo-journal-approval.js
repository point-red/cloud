import api from '@/api'

const url = '/accounting/approval/memo-journals'

const state = {
  accountingMemoJournals: [],
  pagination: {}
}

const getters = {
  accountingMemoJournals: state => {
    return state.accountingMemoJournals
  },
  allAccountingMemoJournals: (state, getters) => (accountingMemoJournals) => {
    let results = []

    accountingMemoJournals.forEach(accountingMemoJournal => {
      const subs = [...accountingMemoJournal.accountingMemoJournals]
      delete accountingMemoJournal.accountingMemoJournals

      results.push(accountingMemoJournal)
      results = results.concat(getters.allAccountingMemoJournals(subs))
    })

    return results
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  SET_ACCOUNTINGMEMOJOURNALS (state, accountingMemoJournals) {
    state.accountingMemoJournals = accountingMemoJournals
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

    commit('SET_ACCOUNTINGMEMOJOURNALS', data)
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
