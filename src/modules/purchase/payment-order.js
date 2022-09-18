import api from '@/api/nodeServer'

const url = '/purchase/payment-order'

// const dummyDataList = {
//   data: [
//     {
//       payment_order_id: 5,
//       date: '2022-09-12T00:00:00.000Z',
//       form_number: 'PP2101001',
//       supplier: 'Supplier Test',
//       notes: 'string',
//       value: '35000.000000000000000000000000000000',
//       approval_status: 'Pending',
//       done_status: 'Pending'
//     }
//   ],
//   meta: {
//     current_page: 1,
//     last_page: 1,
//     per_page: 10,
//     total: 3
//   }
// }

const state = {
  purchasePaymentOrder: {
    date: null
  },
  purchasePaymentOrders: [],
  pagination: {},
  references: {}
}

const getters = {
  purchasePaymentOrder: state => {
    return state.purchasePaymentOrder
  },
  purchasePaymentOrders: state => {
    console.log(state)
    return state.purchasePaymentOrders
  },
  pagination: state => {
    return state.pagination
  },
  references: state => {
    return state.references
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.purchasePaymentOrders = payload.data
    state.pagination = payload.meta
  },
  'FETCH_REFERENCES' (state, payload) {
    state.references = payload.data
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
  getReferences ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(`${url}/reference/${payload.id}`)
        .then(response => {
          commit('FETCH_REFERENCES', response)
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
