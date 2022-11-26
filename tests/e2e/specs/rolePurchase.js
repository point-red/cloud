const { should } = require("chai")
const url = '/human-resource/employee-group'
const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT') + '/human-resource/employee/groups'
const getList = apiUrl + '**'
const getDetail = apiUrl + '/*'
const timeOut = { timeout : 300000 }

describe('Role Permission', () => {
  beforeEach(() => {
    cy.hideXHR()
    cy.login('admin', 'admin')
  })

  it('able to check the delete/create/approve ability in purchase receive  feature', () => {
    cy.interceptToken()
    cy.visit('master/user')
    cy.waitToken()

    cy.waitVisible('#main-container > .content');
    cy.get('.nav').find('a').contains('ROLE & PERMISSION').should('be.visible').click()
  })
})
  