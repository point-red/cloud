import { generateText, createPurchaseReceive } from './functions'

const { should } = require('chai')
const randomString = generateText(7)
const url = '/purchase/receive'
const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT') + '/human-resource/employee/groups'
const getList = apiUrl + '**'
const getDetail = apiUrl + '/*'
const timeOut = { timeout: 300000 }

describe('Purchase - Purchase receive', () => {
  beforeEach(() => {
    cy.hideXHR()
    cy.login('admin', 'admin')
  })

  it('Click create purchase receive form will be able to select purchase order', () => {
    cy.interceptToken()
    cy.visit('/purchase/receive')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > div > div > div > div > a[href="/purchase/receive/create"]').should('have.class', 'input-group-prepend').should('be.visible').click()
    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > form').contains('PURCHASE RECEIVE').should('be.visible')
    cy.get('table.table.table-sm.table-bordered').find('tr').contains('  PURCHASE ORDER  ').should('be.visible').find('td').contains(' SELECT ').should('be.visible').click({ force: true })
  })

  it('Click create purchase receive form will be able to select warehouse', () => {
    cy.interceptToken()
    cy.visit('/purchase/receive')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > div > div > div > div > a[href="/purchase/receive/create"]').should('have.class', 'input-group-prepend').should('be.visible').click()
    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > form').contains('PURCHASE RECEIVE').should('be.visible')
    cy.get('table.table.table-sm.table-bordered').find('tr').contains('  WAREHOUSE  ').should('be.visible').find('td').contains(' SELECT ').should('be.visible').click({ force: true })
  })

  it('Click to select purchase order', () => {
    cy.interceptToken()
    cy.visit('/purchase/receive')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > div > div > div > div > a[href="/purchase/receive/create"]').should('have.class', 'input-group-prepend').should('be.visible').click()
    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > form').contains('PURCHASE RECEIVE').should('be.visible')
    cy.get('table.table.table-sm.table-bordered').find('tr').contains('  PURCHASE ORDER  ').should('be.visible').find('td').contains(' SELECT ').should('be.visible').click({ force: true })
    cy.waitVisible('.sweet-content-content > .list-group push')
    cy.get('a.list-group-item.list-group-item-action').click({ force: true })
  })
})
