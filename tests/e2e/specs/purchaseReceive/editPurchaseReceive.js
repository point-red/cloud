import { generateText, createPurchaseReceive } from './functions'

const { should } = require('chai')
const randomString = generateText(7)
const url = '/purchase/receive'
const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT') + '/purchase/receives'
const getList = apiUrl + '**'
const getDetail = apiUrl + '/*'
const timeOut = { timeout: 300000 }

describe('Purchase - Purchase receive', () => {
  beforeEach(() => {
    cy.hideXHR()
    cy.login('admin', 'admin')
  })

  it('Able to see edit purchase receive button', () => {
    cy.interceptToken()
    cy.visit('/purchase/receive')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > div > div > div > div > a[href="/purchase/receive/create"]').should('have.class', 'input-group-prepend').should('be.visible').click()
  })

  it('Able to see edit purchase receive form', () => {
    cy.interceptToken()
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > div > div > div > div > a[href="/purchase/receive/create"]').should('have.class', 'input-group-prepend').should('be.visible').click()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > form').contains('PURCHASE RECEIVE').should('be.visible')
  })

  it('Submit edit purchase receive form', () => {
    cy.interceptToken()
    cy.visit('/purchase/receive')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > div > div > div > div > a[href="/purchase/receive/create"]').should('have.class', 'input-group-prepend').should('be.visible').click()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > form').contains('PURCHASE RECEIVE').should('be.visible')

    cy.get('#main-container > .content > div > form button').contains('SAVE').should('be.visible').click()
  })

  it.only('Submit edit purchase receive form with quantity = 0', () => {
    cy.interceptToken()
    cy.visit('purchase/receive/')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')

    cy.waitVisible('tbody > tr')
    cy.get('tbody > tr')
      .find('td')
      .each(($element) => {
        cy.wrap($element).invoke('text').then(text => {
          if (text.includes('PENDING')) {
            cy.wrap($element).siblings('th').children('a').click()
            cy.waitVisible('#main-container > .content')
          }
        })
      })
    cy.get('.text-right').find('a').contains(' EDIT ').should('be.visible').click({ force: true })

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > form').contains('PURCHASE RECEIVE').should('be.visible')
    // cy.get('form-control.form-number.text-right.bg-white')
    //   .should('be.visible')
    //   .type('0')
    cy.get('#main-container > .content > div > form').contains('PURCHASE RECEIVE').get('input.form-control.form-number.text-right.bg-white').clear()
    cy.get('#main-container > .content > div > form').contains('PURCHASE RECEIVE').get('input.form-control.form-number.text-right.bg-white').type('0')
    cy.get('#main-container > .content > div > form button').contains('SAVE').should('be.visible').click()
  })
})
