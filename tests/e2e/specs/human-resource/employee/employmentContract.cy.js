import { generateText, createEmploymentContract } from '../functions'

const { should } = require("chai")
const randomString = generateText(7)
const url = '/human-resource/employee-status'
const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT') + '/human-resource/employee/statuses'
const getList = apiUrl + '**'
const getDetail = apiUrl + '/*'
const timeOut = { timeout : 300000 }

describe('HR - Employment Contract', () => {
  beforeEach(() => {
    cy.hideXHR()
    cy.login('admin', 'admin')
  })

  it('index employment contract', () => {
    cy.interceptToken()
    cy.visit('/')
    cy.waitToken()

    cy.waitVisible('#main-container > .content');
    cy.get('#main-container > .content > .row > div > div > a').contains('MAIN MENU').click()

    cy.waitVisible('#main-container > .content');
    cy.get('#main-container > .content > .row > div > div > a').contains('HUMAN RESOURCE').click()

    cy.waitVisible('#main-container > .content');
    cy.get('#main-container > .content > div > .row > div:nth-child(1) > div > a').contains('EMPLOYEE').click()

    cy.waitVisible('li.nav-item');
    cy.get('li.nav-item a').contains('EMPLOYMENT CONTRACT').click()

    cy.intercept('GET', getList).as('getEmploymentContract')

    cy.wait(5000)
    cy.wait('@getEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table th').should('contain', 'Name')
  })

  it('Create employment contract', () => {
    createEmploymentContract(randomString)
  })

  it('Edit employment contract', () => {
    cy.interceptToken()
    cy.intercept('GET', getList).as('getEmploymentContract')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('#search-text');
    cy.get('#search-text').type(randomString)
    cy.wait('@getEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)

    cy.intercept('GET', getDetail).as('getDetailEmploymentContract')

    cy.waitVisible('table');
    cy.get('table a').contains(randomString).click()

    cy.wait('@getDetailEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)
    cy.get('input#name', timeOut).should('have.value', randomString)
    cy.wait(2000)
    cy.get('.block-content').contains('EDIT').click()

    cy.waitVisible('.sweet-title');
    cy.get('.sweet-title').should('contain', 'EDIT EMPLOYMENT CONTRACT')
  
    cy.wait('@getDetailEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)
    cy.wait(2000)
    cy.get('.sweet-content-content input#name')
      .last()
      .clear()
      .type(randomString + ' - edit')

    cy.intercept('PATCH', getDetail).as('updateEmploymentContract')

    cy.wait(1500)
    cy.get('.sweet-content-content > .pull-right > button').last().click()

    cy.wait('@updateEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)
    cy.get('div.vue-notification', timeOut).should('have.class', 'success').and('contain', 'update success')

    cy.wait(1500)
    cy.get('input#name', timeOut).should('have.value', randomString + ' - edit')
  })

  it('Delete employment contract', () => {
    cy.interceptToken()
    cy.intercept('GET', getList).as('getEmploymentContract')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('#search-text');
    cy.get('#search-text').type(randomString)
    cy.wait('@getEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)

    cy.intercept('GET', getDetail).as('getDetailEmploymentContract')

    cy.wait(2000)
    cy.waitVisible('table');
    cy.get('table a').contains(randomString + ' - edit').click()

    cy.wait('@getDetailEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)
    cy.get('input#name', timeOut).should('have.value', randomString + ' - edit')
    cy.wait(2000)
    cy.get('.block-content').contains('DELETE').click()

    cy.intercept('DELETE', getDetail).as('deleteEmploymentContract')

    cy.waitVisible('.swal2-container')
    cy.get('.swal2-container button').contains('Confirm').click()

    cy.wait('@deleteEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)
    
    cy.wait(1500)
    cy.url().should('contain', url)
  })
})
  