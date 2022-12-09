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

  it('index purchase receive', () => {
    cy.interceptToken()
    cy.visit('/')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > .row > div > div > a').contains('MAIN MENU').click()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > .row > div > div > a').contains('PURCHASE').should('be.visible').click()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > a').contains('PURCHASE RECEIVE').should('be.visible').click()

    cy.intercept('GET', getList).as('getPurchaseReceive')

    cy.wait(2000)
    cy.wait('@getPurchaseReceive', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table')
    cy.get('table th').should('contain', 'Number')
      .should('contain', 'Date')
      .should('contain', 'Supplier')
      .should('contain', 'Warehouse')
      .should('contain', 'Item')
      .should('contain', 'Notes')
      .should('contain', 'Quantity')
      .should('contain', 'Price')
      .should('contain', 'Value')
      .should('contain', 'Form Status')
  })

  it('search purchase receive', () => {
    cy.interceptToken()
    cy.visit('/purchase/receive')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('#main-container > .content > div > div > div > div > div > div > a').contains('ADVANCE FILTER').should('be.visible').click()

    cy.get('#main-container > .content > div > div > div > div > div > div .row label').should('contain', 'DATE START')
      .should('contain', 'DATE END')
      .should('contain', 'FORM STATUS')

    cy.get('#main-container > .content > div > div > div > div > div > div .row span').should('contain', 'SELECT').click()
    cy.get('.sweet-title', timeOut).should('contain', 'SELECT FORM STATUS')
    cy.get('.sweet-content-content .list-group a').should('contain', 'DONE').should('contain', 'PENDING').should('contain', 'CANCELED')
    cy.get('.sweet-content-content .list-group a').contains('DONE').click()

    cy.waitVisible('table')
    cy.get('table td').should('contain', 'DONE')

    cy.get('#main-container > .content > div > div > div > div > div > div .row span').should('contain', 'DONE').click()
    cy.get('.sweet-title', timeOut).should('contain', 'SELECT FORM STATUS')
    cy.get('.sweet-content-content .list-group a').contains('PENDING').click()

    cy.waitVisible('table')
    cy.get('table td').should('contain', 'PENDING')

    cy.get('#main-container > .content > div > div > div > div > div > div .row span').should('contain', 'PENDING').click()
    cy.get('.sweet-title', timeOut).should('contain', 'SELECT FORM STATUS')
    cy.get('.sweet-content-content .list-group a').contains('CANCELED').click()

    cy.waitVisible('table')
    cy.get('table td').should('contain', 'CANCELED')
  })
})
