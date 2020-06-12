import i18n from '@/lang/lang'

const state = {
  locale: 'en'
}

const getters = {
  locale: state => {
    return state.locale
  }
}

const mutations = {
  updateLang (state, payload) {
    state.locale = payload
    i18n.locale = payload
  }
}

const actions = {
  async setLang ({ commit }, payload) {
    console.log(payload)
    if (payload in i18n.messages) {
      commit('updateLang', payload)
      localStorage.setItem('locale', payload)
    } else {
      // try {
      //   // const res = await this.axios.get(`./src/lang/locale/${payload}.json`)
      //   const res = await import(`./${payload}.json`)
      //   i18n.setLocaleMessage(payload, res.data)
      //   commit('updateLang', payload)
      //   localStorage.setItem('locale', payload)
      // } catch (e) {
      //   console.log(e)
      // }
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
