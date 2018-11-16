const state = {
  firstUri: '',
  secondUri: ''
}

const getters = {
  firstUri: state => {
    return state.firstUri
  },
  secondUri: state => {
    return state.secondUri
  }
}

const mutations = {
  updateUri (state, payload) {
    state.firstUri = payload[1]
    if (payload[2]) {
      state.secondUri = payload[2]
    } else {
      state.secondUri = ''
    }
  }
}

const actions = {
  updateUri ({ commit }, payload) {
    var uri = payload.split('/')
    commit('updateUri', uri)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
