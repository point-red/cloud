import { generateText, generateNumber, createEmployee } from '../functions'

const { should } = require("chai")
const name = generateText(7)
const personalId = generateText(7)
const email = generateText(7) + '@mail.com'
const address = generateText(7)
const phone = generateNumber(11)
const code = generateNumber(4)
const jobTitle = generateText(6)
const note = generateText(15)
const url = '/human-resource/employee'
const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT') + '/human-resource/employee/employees'
const getList = apiUrl + '**'
const getDetail = apiUrl + '/*'
const timeOut = { timeout : 300000 }

describe('HR - Employee', () => {
  beforeEach(() => {
    cy.hideXHR()
    cy.login('admin', 'admin')
  })

  it('index employee', () => {
    cy.interceptToken()
    cy.visit('/')
    cy.waitToken()

    cy.waitVisible('#main-container > .content');
    cy.get('#main-container > .content > .row > div > div > a').contains('MAIN MENU').click()

    cy.waitVisible('#main-container > .content');
    cy.get('#main-container > .content > .row > div > div > a').contains('HUMAN RESOURCE').click()

    cy.intercept('GET', getList).as('getEmployee')

    cy.waitVisible('#main-container > .content');
    cy.get('#main-container > .content > div > .row > div:nth-child(1) > div > a').contains('EMPLOYEE').click()

    cy.wait(5000)
    cy.wait('@getEmployee').its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table th').should('contain', 'name')
    cy.get('table th').should('contain', 'job title')
    cy.get('table th').should('contain', 'department')
  })

  it('Create employee', () => {
    createEmployee({
      name: name,
      personalId: personalId,
      email: email,
      address: address,
      phone: phone,
      code: code,
      jobTitle: jobTitle,
      note: note
    })
  })

  it('Edit employee', () => {
    cy.interceptToken()
    cy.intercept('GET', getList).as('getEmployee')

    cy.visit(url)

    cy.waitToken()
    cy.wait('@getEmployee', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('#search-text');
    cy.get('#search-text').type(name)
    cy.wait('@getEmployee').its('response.statusCode').should('equal', 200)

    cy.get('table a', timeOut).contains(name).click()

    cy.intercept('GET', getDetail).as('getDetailEmployee')

    cy.get('.block-content table:nth-child(1) tbody > tr > td:nth-child(2)', timeOut)
      .should('contain', name)
    cy.wait(2000)
    cy.get('.block-content').contains('EDIT').click()

    cy.wait('@getDetailEmployee', timeOut).its('response.statusCode').should('equal', 200)

    cy.get('.sweet-title', timeOut).should('contain', 'EMPLOYEE INFORMATION')
    
    cy.get('.sweet-content-content input#name').last(timeOut).should('have.value', name)
    cy.wait(2000)
    cy.get('.sweet-content-content input#name').last().clear().type(name + ' - edit')

    cy.intercept('PATCH', getDetail).as('updateEmployee')

    cy.get('.sweet-modal-overlay').each(($el) => {
      if ($el.css('display') != 'none') {
        cy.wrap($el).find('.sweet-content-content > .pull-right > button').click()
      }
    })

    cy.wait('@updateEmployee', timeOut).its('response.statusCode').should('equal', 200)
    cy.get('div.vue-notification', timeOut).should('have.class', 'success').and('contain', 'update success')
    cy.wait('@getDetailEmployee', timeOut).its('response.statusCode').should('equal', 200)

    cy.get('.block-content table:nth-child(1) tbody > tr > td:nth-child(2)', timeOut)
      .should('contain', name + ' - edit')
  })

  it('Delete employee', () => {
    cy.interceptToken()
    cy.intercept('GET', getList).as('getEmployee')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getEmployee').its('response.statusCode').should('equal', 200)

    cy.waitVisible('#search-text');
    cy.get('#search-text').type(name)
    cy.wait('@getEmployee').its('response.statusCode').should('equal', 200)

    cy.intercept('GET', getDetail).as('getDetailEmployee')

    cy.waitVisible('table');
    cy.get('table a').contains(name + ' - edit').click()
    
    cy.wait('@getDetailEmployee', timeOut).its('response.statusCode').should('equal', 200)
    
    cy.get('.block-content table:nth-child(1) tbody > tr > td:nth-child(2)', timeOut)
      .should('contain', name)
    cy.wait(2000)
    cy.get('.block-content').contains('DELETE').click()
    
    cy.intercept('DELETE', getDetail).as('deleteEmployee')
    
    cy.waitVisible('.swal2-container')
    cy.get('.swal2-container button').contains('Confirm').click()
    cy.wait('@deleteEmployee', timeOut).its('response.statusCode').should('equal', 200)
    
    cy.wait(1500)
    cy.url().should('contain', url)
  })
})
  