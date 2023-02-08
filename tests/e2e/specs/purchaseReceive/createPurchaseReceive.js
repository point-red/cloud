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

  it('Able to see create purchase receive button', () => {
    cy.interceptToken()
    cy.visit('/purchase/receive')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > div > div > div > div > a[href="/purchase/receive/create"]').should('have.class', 'input-group-prepend').should('be.visible').click()
  })

  it('Able to see create purchase receive form', () => {
    cy.interceptToken()
    cy.visit('/purchase/receive')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > div > div > div > div > a[href="/purchase/receive/create"]').should('have.class', 'input-group-prepend').should('be.visible').click()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > form').contains('PURCHASE RECEIVE').should('be.visible')
  })

  it('Submit create purchase receive form', () => {
    cy.interceptToken()
    cy.visit('/purchase/receive')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > div > div > div > div > a[href="/purchase/receive/create"]').should('have.class', 'input-group-prepend').should('be.visible').click()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > form').contains('PURCHASE RECEIVE').should('be.visible')

    cy.get('#main-container > .content > div > form button').contains('SAVE').should('be.visible').click()
  })

  it('Able to see purchase receive details', () => {
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
  })

  it('Do not have access branch and click create button', () => {
    cy.interceptToken()
    cy.visit('master/branch/')
    cy.waitToken()

    cy.waitVisible('tbody > tr')
    cy.get('tbody > tr')
      .find('td')
      .each(($element) => {
        cy.wrap($element).invoke('text').then(text => {
          if (text.includes('CENTRAL')) {
            cy.wrap($element).find('a').click()
            cy.waitVisible('#main-container > .content')
          }
        })
      })

    cy.waitVisible('tbody > tr')
    cy.get('tbody > tr')
      .find('td')
      .each(($element) => {
        cy.wrap($element).then(text => {
          cy.get('[type="checkbox"]').uncheck()
        })
      })

    cy.interceptToken()
    cy.visit('purchase/receive/')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > div > div > div > div > a[href="/purchase/receive/create"]').should('have.class', 'input-group-prepend').should('be.visible').click()
  })

  it('Submit create purchase receive form without filled form', () => {
    cy.interceptToken()
    cy.visit('/purchase/receive')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > div > div > div > div > a[href="/purchase/receive/create"]').should('have.class', 'input-group-prepend').should('be.visible').click()
    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > form button').contains('SAVE').should('be.visible').click()
  })
})
