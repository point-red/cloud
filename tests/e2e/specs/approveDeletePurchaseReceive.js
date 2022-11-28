const { should } = require('chai')
const url = '/human-resource/employee-group'
const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT') + '/human-resource/employee/groups'
const getList = apiUrl + '**'
const getDetail = apiUrl + '/*'
const timeOut = { timeout: 300000 }

describe('Approve Deletion Purchase Receive', () => {
  beforeEach(() => {
    cy.hideXHR()
    cy.login('admin', 'admin')
  })

  it('Find the receive not canceled and delete it', () => {
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
    cy.get('.text-right').find('button').contains(' DELETE ').should('be.visible').click({ force: true })
    cy.get('div.sweet-modal.theme-light.has-title.has-content.is-mobile-fullscreen.is-visible textarea')
      .should('be.visible')
      .type('test reason delete receive')
    cy.get('div.sweet-modal.theme-light.has-title.has-content.is-mobile-fullscreen.is-visible button[type="button"]')
      .should('be.visible')
      .click()

    // Test case: Click approve deletion
    cy.get('div.alert.alert-warning.d-flex.align-items-center.justify-content-between.mb-15')
      .find('button[type="button"]').contains(' APPROVE ')
      .should('be.visible')
      .click()
  })
})
