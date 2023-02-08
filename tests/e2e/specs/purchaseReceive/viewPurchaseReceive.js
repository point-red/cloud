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

  it.only('Do not have access to branch will not be able to view the details', () => {
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
  })
})
