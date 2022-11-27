const { should } = require('chai')
const url = '/human-resource/employee-group'
const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT') + '/human-resource/employee/groups'
const getList = apiUrl + '**'
const getDetail = apiUrl + '/*'
const timeOut = { timeout: 300000 }

describe('Print Purchase Receive', () => {
  beforeEach(() => {
    cy.hideXHR()
    cy.login('admin', 'admin')
  })

  // it('able to see a print icon on the top left of the form', () => {
  //   cy.interceptToken()
  //   cy.visit('purchase/receive/1')
  //   cy.waitToken()

  //   cy.waitVisible('#main-container > .content')
  // })

  // it('click on the print button will show up print setting page', () => {
  //   cy.interceptToken()
  //   cy.visit('purchase/receive/1')
  //   cy.waitToken()

  //   cy.waitVisible('#main-container > .content')
  //   cy.get('.text-right').find('button').contains(' PRINT ').should('be.visible').click({ force: true })
  // })

  it('If purchase receive was canceled, there is a watermark in print preview', () => {
    cy.interceptToken()
    cy.visit('purchase/receive/')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')

    cy.waitVisible('tbody > tr')
    cy.get('tbody > tr')
      .find('td')
      .each(($element) => {
        cy.wrap($element).invoke('text').then(text => {
          if (text.includes('CANCELED')) {
            cy.wrap($element).siblings('th').children('a').click()
            cy.waitVisible('#main-container > .content')
          }
        })
      })
    cy.waitVisible('.alert-danger')
    cy.get('.text-right').find('button').contains(' PRINT ').should('be.visible').click({ force: true })
  })
})
