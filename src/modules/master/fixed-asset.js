import api from '@/api'

const url = '/master/fixed-assets'

const state = {
  fixedAsset: {
    code: '',
    name: '',
    fixed_asset_group_id: null,
    useful_life_year: null,
    salvage_value: null,
    account: {
      number: '',
      name: '',
      alias: ''
    },
    depreciation_account: {
      number: '',
      name: '',
      alias: ''
    },
    accummulation_account: {
      number: '',
      name: '',
      alias: ''
    }
  },
  fixedAssets: [
    {
      code: '',
      name: '',
      fixed_asset_group_id: null,
      useful_life_year: null,
      salvage_value: null,
      account: {
        number: '',
        name: '',
        alias: ''
      },
      depreciation_account: {
        number: '',
        name: '',
        alias: ''
      },
      accummulation_account: {
        number: '',
        name: '',
        alias: ''
      }
    }
  ],
  pagination: {}
}

const getters = {
  fixedAsset: state => {
    return state.fixedAsset
  },
  fixedAssets: state => {
    return state.fixedAssets
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.fixedAssets = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.fixedAsset = payload.data
  },
  'CREATE' (state, payload) {
    state.fixedAsset = payload
  },
  'UPDATE' (state, payload) {
    state.fixedAsset = payload
  },
  'DELETE' (state, payload) {
    state.fixedAsset = {}
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
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id, payload)
        .then(response => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url, payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  update (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id, payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  delete (context, payload) {
    return new Promise((resolve, reject) => {
      api.delete(url + '/' + payload.id, payload)
        .then(response => {
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
