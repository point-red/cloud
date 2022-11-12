import { generateText } from '../functions'

const { should } = require("chai")
const randomString = generateText(7)
const url = '/human-resource/additional-component'
const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT') + '/human-resource/employee/additional-components'
const getList = apiUrl + '**'
const getDetail = apiUrl + '/*'
const timeOut = { timeout : 300000 }

describe('HR - Additional Component', () => {
  beforeEach(() => {
    cy.hideXHR()
    cy.login('admin', 'admin')
  })

  it('index additional components', () => {
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
    cy.get('li.nav-item a').contains('ADDITIONAL COMPONENT').click()

    cy.intercept('GET', getList).as('getAdditionalComponent')

    cy.wait(5000)
    cy.waitVisible('table');

    cy.wait('@getAdditionalComponent', timeOut).its('response.statusCode').should('equal', 200)
    cy.get('table th').should('contain', 'name')
    cy.get('table th').should('contain', 'source')
    cy.get('table th').should('contain', 'weight')
  })

  it('Create additional components', () => {
    cy.interceptToken()
    cy.intercept('GET', getList).as('getAdditionalComponent')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getAdditionalComponent', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('.input-group-prepend');
    cy.get('.input-group-prepend').click()

    cy.get('.sweet-title', timeOut).should('contain', 'ADD ADDITIONAL COMPONENT')
    cy.wait(1000)
    cy.get('.sweet-content-content input').eq(0).type(randomString)
    cy.wait(1000)
    cy.get('.sweet-content-content input').eq(1).type(123)
    cy.wait(1000)
    cy.get('.sweet-content-content span.link').click()
    cy.wait(1000)
    cy.get('.sweet-content-content #selectautomated-code a').first().click()

    cy.intercept('POST', getList).as('createAdditionalComponent')

    cy.get('.sweet-content-content > .pull-right > button').click()

    cy.wait('@createAdditionalComponent', timeOut).its('response.statusCode').should('equal', 201)
    cy.get('div.vue-notification', timeOut).should('have.class', 'success').and('contain', 'create success')

    cy.wait(1500)
    cy.url().should('contain', url)
    cy.wait('@getAdditionalComponent', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('#search-text');
    cy.get('#search-text').clear().type(randomString)
    cy.wait('@getAdditionalComponent', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table td');
    cy.get('table td').should('contain', randomString)
  })

  it('Edit additional components', () => {
    cy.interceptToken()
    cy.intercept('GET', getList).as('getAdditionalComponent')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getAdditionalComponent', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('#search-text');
    cy.get('#search-text').type(randomString)
    cy.wait('@getAdditionalComponent', timeOut).its('response.statusCode').should('equal', 200)

    cy.wait(2000)
    cy.get('table a', timeOut).contains(randomString).click()

    cy.get('input#name', timeOut).should('have.value', randomString)
    cy.get('.block-content').contains('EDIT').click()

    
    cy.waitVisible('.sweet-title');
    cy.get('.sweet-title').should('contain', 'EDIT ADDITIONAL COMPONENT')
    
    cy.wait(2000)
    cy.get('.sweet-content-content input#name').last(timeOut).should('have.value', randomString)
    cy.get('.sweet-content-content input#name')
    .last()
    .clear()
    .type(randomString + ' - edit')

    cy.wait(1500)
    cy.intercept('PATCH', getDetail).as('updateAdditionalComponent')
    cy.intercept('GET', getDetail).as('getDetailAdditionalComponent')

    cy.get('.sweet-content-content > .pull-right > button').last().click()

    cy.wait('@updateAdditionalComponent', timeOut).its('response.statusCode').should('equal', 200)
    cy.get('div.vue-notification', timeOut).should('have.class', 'success').and('contain', 'update success')
    cy.wait('@getDetailAdditionalComponent', timeOut).its('response.statusCode').should('equal', 200)

    cy.wait(1500)
    cy.get('input#name', timeOut).should('have.value', randomString + ' - edit')
  })

  it('Delete additional components', () => {
    cy.interceptToken()
    cy.intercept('GET', getList).as('getAdditionalComponent')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getAdditionalComponent', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('#search-text');
    cy.get('#search-text').type(randomString)
    cy.wait('@getAdditionalComponent', timeOut).its('response.statusCode').should('equal', 200)

    cy.wait(2000)
    cy.waitVisible('table');
    cy.get('table a').contains(randomString + ' - edit').click()

    cy.get('input#name', timeOut).should('have.value', randomString + ' - edit')
    cy.get('.block-content').contains('DELETE').click()
    
    cy.intercept('DELETE', getDetail).as('deleteAdditionalComponent')

    cy.waitVisible('.swal2-container')
    cy.get('.swal2-container button').contains('Confirm').click()
    cy.wait('@deleteAdditionalComponent', timeOut).its('response.statusCode').should('equal', 204)
    
    cy.wait(1500)
    cy.url().should('contain', url)
  })
})
  