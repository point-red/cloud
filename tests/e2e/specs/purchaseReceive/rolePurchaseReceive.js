import { generateText, createRole } from './functions'

const randomString = generateText(7)
const { should } = require('chai')
const url = '/master/role'
const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT') + '/master/role'
const getList = apiUrl + '**'
const getDetail = apiUrl + '/*'
const timeOut = { timeout: 300000 }

describe('Role Permission', () => {
  beforeEach(() => {
    cy.hideXHR()
    cy.login('admin', 'admin')
  })

  it('able to check the delete/create/approve ability in purchase receive  feature', () => {
    cy.interceptToken()
    cy.visit('master/user')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')
    cy.get('.nav').find('a').contains('ROLE & PERMISSION').should('be.visible').click()

    cy.intercept('GET', getList).as('getRole')

    cy.wait(5000)
    cy.wait('@getRole', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table')
    cy.get('table th').should('contain', 'Role')
  })

  it('Create Role', () => {
    createRole(randomString)
  })
})
