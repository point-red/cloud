const state = {
  openLeftSidebar: true,
  openLeftSidebarXs: false,
  openHeaderDropdown: false,
  openSideOverlay: false,
  isPageLoaderOpened: false,
  isSidebarInverse: true,
  isLoadingBlock: false
}

const getters = {
  openLeftSidebar: state => {
    return state.openLeftSidebar
  },
  openLeftSidebarXs: state => {
    return state.openLeftSidebarXs
  },
  openSideOverlay: state => {
    return state.openSideOverlay
  },
  openHeaderDropdown: state => {
    return state.openHeaderDropdown
  },
  isPageLoaderOpened: state => {
    return state.isPageLoaderOpened
  },
  isSidebarInverse: state => {
    return state.isSidebarInverse
  },
  isLoadingBlock: state => {
    return state.isLoadingBlock
  }
}

const mutations = {
  toggleLeftSidebar (state, payload) {
    // convert it to boolean because local storage store them as string
    if (state.openLeftSidebar === 'true') {
      state.openLeftSidebar = true
      state.openLeftSidebarXs = true
    } else if (state.openLeftSidebar === 'false') {
      state.openLeftSidebar = false
      state.openLeftSidebarXs = false
    }

    if (payload === 'close-xs') {
      state.openLeftSidebarXs = false
    } else {
      state.openLeftSidebar = !state.openLeftSidebar
      state.openLeftSidebarXs = !state.openLeftSidebarXs
    }
    localStorage.setItem('openLeftSidebar', state.openLeftSidebar)
  },
  toggleSideOverlay (state, payload) {
    // convert it to boolean because local storage store them as string
    if (state.openSideOverlay === 'true') {
      state.openSideOverlay = true
    } else if (state.openSideOverlay === 'false') {
      state.openSideOverlay = false
    }

    state.openSideOverlay = !state.openSideOverlay
    localStorage.setItem('openSideOverlay', state.openSideOverlay)
  },
  toggleHeaderDropdown (state, payload) {
    // convert it to boolean because local storage store them as string
    if (state.openHeaderDropdown === 'true') {
      state.openHeaderDropdown = true
    } else if (state.openHeaderDropdown === 'false') {
      state.openHeaderDropdown = false
    }

    state.openHeaderDropdown = !state.openHeaderDropdown

    localStorage.setItem('openHeaderDropdown', state.openHeaderDropdown)
  },
  closeHeaderDropdown (state, payload) {
    state.openHeaderDropdown = false
    localStorage.setItem('openHeaderDropdown', state.openHeaderDropdown)
  },
  openPageLoader (state, payload) {
    state.isPageLoaderOpened = true
  },
  closePageLoader (state, payload) {
    state.isPageLoaderOpened = false
  },
  toggleSidebarInverse (state, payload) {
    if (state.isSidebarInverse === 'true') {
      state.isSidebarInverse = true
    } else if (state.isSidebarInverse === 'false') {
      state.isSidebarInverse = false
    }

    state.isSidebarInverse = !state.isSidebarInverse

    localStorage.setItem('isSidebarInverse', state.isSidebarInverse)
  },
  showLoadingBlock (state, payload) {
    state.isLoadingBlock = true
  },
  dismissLoadingBlock (state, payload) {
    state.isLoadingBlock = false
  }
}

const actions = {
  toggleLeftSidebar ({ commit }, payload) {
    commit('toggleLeftSidebar', payload)
  },
  toggleSideOverlay ({ commit }, payload) {
    commit('toggleSideOverlay', payload)
  },
  toggleHeaderDropdown ({ commit }, payload) {
    commit('toggleHeaderDropdown', payload)
  },
  closeHeaderDropdown ({ commit }, payload) {
    commit('closeHeaderDropdown', payload)
  },
  openPageLoader ({ commit }) {
    commit('openPageLoader')
  },
  closePageLoader ({ commit }) {
    commit('closePageLoader')
  },
  toggleSidebarInverse ({ commit }, payload) {
    commit('toggleSidebarInverse', payload)
  },
  showLoadingBlock ({ commit }) {
    commit('showLoadingBlock')
  },
  dismissLoadingBlock ({ commit }) {
    commit('dismissLoadingBlock')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
