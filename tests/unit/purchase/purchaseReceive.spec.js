// import TabMenu from '@/views/master/Index.vue'
// import PointPermission from '@/components/point-permission'
// import Vuex from 'vuex'
// import Vue from 'vue'
// import { mount, createLocalVue } from '@vue/test-utils'
// import Role from '@/modules/master/role'
// // import Auth from '@/modules/auth'

// const VueWithVuex = createLocalVue()
// VueWithVuex.use(Vuex)

// Vue.use(PointPermission)

// describe('mount a componet', () => {
//   const $t = () => {}
//   const store = new Vuex.Store(Role)

//   const wrapper = mount(TabMenu, {
//     mocks: { $t },
//     localVue: VueWithVuex,
//     store
//   })

//   // store.state.permissions.push('create purchase receive')
//   console.log(wrapper)
// })
describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'Welcome to Your Vue.js App')
  })
})