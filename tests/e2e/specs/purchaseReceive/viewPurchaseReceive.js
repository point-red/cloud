const { should } = require('chai')
const url = '/human-resource/employee-group'
const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT') + '/human-resource/employee/groups'
const getList = apiUrl + '**'
const getDetail = apiUrl + '/*'
const timeOut = { timeout: 300000 }

describe('View Purchase Receive', () => {
  beforeEach(() => {
    cy.hideXHR()
    cy.login('admin', 'admin')
  })

  it('Access to purchase receive list', () => {
    cy.interceptToken()
    cy.visit('purchase/receive/')
    cy.waitToken()
    cy.waitVisible('#main-container > .content')
    cy.waitVisible('table')
  })

  it('Click on any receive ID to show detail', () => {
    cy.interceptToken()
    cy.visit('purchase/receive/')
    cy.waitVisible('tbody > tr')
    cy.get('tbody > tr').first().find('th').children('a').click()
    cy.waitToken()
    cy.waitVisible('#main-container > .content')
    cy.waitVisible('table')
  })
})
