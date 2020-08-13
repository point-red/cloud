import api from '@/api'

const url = '/reward/tokens'

const state = {
  tokens: [],
  links: null,
  meta: null
}

const getters = {
  tokens: state => state.tokens,
  balance: state => {
    let balance = 0

    state.tokens.forEach(token => {
      balance += token.amount
    })

    return balance
  }
}

const mutations = {
  SET_TOKENS (state, tokens) {
    state.tokens = tokens
  },
  SET_LINKS (state, links) {
    state.links = links
  },
  SET_META (state, meta) {
    state.meta = meta
  }
}

const actions = {
  async get ({ commit }, payload) {
    const { data, links, meta } = await api.get(url, { params: payload })

    commit('SET_TOKENS', data)
    commit('SET_LINKS', links)
    commit('SET_META', meta)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
