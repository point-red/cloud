import api from '@/api'

const url = '/inventory/approval/transfer-items'

const state = {
  inventoryTransferItems: [],
  pagination: {}
}

const getters = {
  inventoryTransferItems: state => {
    return state.inventoryTransferItems
  },
  allInventoryTransferItems: (state, getters) => (inventoryTransferItems) => {
    let results = []

    inventoryTransferItems.forEach(inventoryTransferItem => {
      const subs = [...inventoryTransferItem.inventoryTransferItems]
      delete inventoryTransferItem.inventoryTransferItems

      results.push(inventoryTransferItem)
      results = results.concat(getters.allinventoryTransferItems(subs))
    })

    return results
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  SET_INVENTORYTRANSFERITEMS (state, inventoryTransferItems) {
    state.inventoryTransferItems = inventoryTransferItems
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

    commit('SET_INVENTORYTRANSFERITEMS', data)
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
