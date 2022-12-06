import { generateText, createKpiTemplate, editKpiTemplate } from '../functions'

const { should } = require("chai")
const templateName = generateText(7)
const templateGroup = generateText(7)
const templateIndicator = generateText(7)
const url = '/human-resource/kpi-template'
const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT') + '/human-resource/kpi/template'
const getList = apiUrl + 's**'
const getDetail = apiUrl + 's/*'
const timeOut = { timeout : 300000 }

describe('HR - KPI Template', () => {
  beforeEach(() => {
    cy.hideXHR()
    cy.login('admin', 'admin')
  })

  it('Index KPI Template', () => {
    cy.interceptToken()
    cy.visit('/')
    cy.waitToken()

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("MAIN MENU").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("HUMAN RESOURCE").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("KPI").click();
  
    cy.intercept('GET', getList).as('getKpiTemplate')

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("KPI TEMPLATE").click();

    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table th').should('contain', 'Kpi Category')
    cy.get('table th').should('contain', 'Total Weight')

    cy.get('.nav-item > a').should('contain', 'ADD')
    cy.get('.nav-item > a').should('contain', 'IMPORT')
  })

  it('Create KPI Template', () => {
    createKpiTemplate(templateName)
  })

  it('Edit KPI Template', () => {
    editKpiTemplate(templateName, templateGroup, templateIndicator)
  })

  it('Duplicate KPI Template', () => {
    cy.interceptToken()
    cy.intercept('GET', getList).as('getKpiTemplate')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table th').should('contain', 'Kpi Category')
    cy.get('table th').should('contain', 'Total Weight')

    cy.get('.nav-item > a').should('contain', 'ADD')
    cy.get('.nav-item > a').should('contain', 'IMPORT')

    cy.waitVisible('#search-text');
    cy.get('#search-text').clear().type(templateName)
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.intercept('POST', getDetail).as('duplicate')

    cy.waitVisible('table');
    cy.get('table td').contains(templateName).parents('tr').find('button').contains('DUPLICATE').click()
    cy.wait('@duplicate', timeOut).its('response.statusCode').should('equal', 201)
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('#search-text');
    cy.get('#search-text').clear().type(templateName + ' (duplicate)')
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table td').should('contain', templateName + ' (duplicate)')
  })

  it('Rename KPI Template', () => {
    cy.interceptToken()
    cy.intercept('GET', getList).as('getKpiTemplate')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table th').should('contain', 'Kpi Category')
    cy.get('table th').should('contain', 'Total Weight')

    cy.get('.nav-item > a').should('contain', 'ADD')
    cy.get('.nav-item > a').should('contain', 'IMPORT')

    cy.waitVisible('#search-text');
    cy.get('#search-text').clear().type(templateName + ' (duplicate)')
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.intercept('PATCH', getDetail).as('updateName')

    cy.waitVisible('table');
    cy.get('table td').contains(templateName + ' (duplicate)').parents('tr').find('a').contains('RENAME').click()

    cy.get('#edit input#name', timeOut).should('have.value', templateName + ' (duplicate)').clear().type(templateName + ' (renamed)')
    cy.wait(1500)
    cy.get('#edit [type=submit]').click()

    cy.wait('@updateName', timeOut).its('response.statusCode').should('equal', 200)
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('#search-text');
    cy.get('#search-text').clear().type(templateName + ' (renamed)')
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    
    cy.get('table td').should('contain', templateName + ' (renamed)')
  })

  it('Export KPI Template', () => {
    cy.interceptToken()
    cy.intercept('GET', getList).as('getKpiTemplate')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table th').should('contain', 'Kpi Category')
    cy.get('table th').should('contain', 'Total Weight')

    cy.get('.nav-item > a').should('contain', 'ADD')
    cy.get('.nav-item > a').should('contain', 'IMPORT')

    cy.waitVisible('#search-text');
    cy.get('#search-text').clear().type(templateName + ' (renamed)')
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.intercept('POST', getDetail).as('export')

    const stub = cy.stub().as('open')
    cy.on('window:before:load', (win) => {
      cy.stub(win, 'open').callsFake(stub)
    })

    cy.waitVisible('table');
    cy.get('table td').contains(templateName + ' (renamed)').parents('tr').find('button').contains('EXPORT').click()

    cy.get('@open', timeOut).should('have.been.calledOnce')

    cy.wait('@export', timeOut).its('response.body.data.url')
      .should('match', /download/).end()
  })

  it('Archive and filter', () => {
    cy.interceptToken()
    cy.intercept('GET', getList).as('getKpiTemplate')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table th').should('contain', 'Kpi Category')
    cy.get('table th').should('contain', 'Total Weight')

    cy.waitVisible('#search-text');
    cy.get('#search-text').clear().type(templateName + ' (renamed)')
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table td')
      .contains(templateName + ' (renamed)')
      .parents('tr')
      .find('td:nth-child(2) input#subscibe')
      .click({force: true})

    cy.intercept('PATCH', getDetail).as('archive')

    cy.get('div.fadeIn button', timeOut).contains('ARCHIVE').click()

    cy.wait('@archive', timeOut).its('response.statusCode').should('equal', 200)
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.log('filter archive')
  
    cy.waitVisible('table');
    cy.get('table th').should('contain', 'Kpi Category')
    cy.get('table th').should('contain', 'Total Weight')

    cy.wait(1500)
    cy.get('.block-content a').contains('ADVANCE FILTER').click()

    cy.wait(1500)
    cy.get('.fadeIn span').contains('SELECT').click()

    cy.wait(1500)
    cy.get('.sweet-modal h2').should('contain', 'SELECT')
    cy.get('.sweet-modal .sweet-content a').contains('ARCHIVED').click()
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table td').should('contain', templateName + ' (renamed)')
  })
  
  it('Impor\'t KPI Template', () => {
    const fileName = 'DEV - KPI Template Export - abc.xlsx'

    cy.interceptToken()
    cy.intercept('GET', getList).as('getKpiTemplate')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table th').should('contain', 'Kpi Category')
    cy.get('table th').should('contain', 'Total Weight')

    cy.intercept('POST', apiUrl + 's/import/check').as('importTemplate')

    cy.get('.nav-item > a').should('contain', 'IMPORT')
    cy.get('.nav-item > a').contains('IMPORT').parent().find('[id="file"]').attachFile(fileName)

    cy.fixture(fileName, 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then(fileContent => {
      cy.get('.nav-item > a').contains('IMPORT').parent().find('[id="file"]')
        .attachFile({ fileContent, fileName, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', encoding:'utf8' })
    })

    cy.wait('@importTemplate', timeOut).its('response.statusCode').should('equal', 200)
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('#search-text');
    cy.get('#search-text').clear().type('abc')
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table td').should('contain', 'abc')
  })

  it('Remove KPI Template', () => {
    cy.interceptToken()
    cy.intercept('GET', getList).as('getKpiTemplate')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('table');
    cy.get('table th').should('contain', 'Kpi Category')
    cy.get('table th').should('contain', 'Total Weight')

    cy.waitVisible('#search-text');
    cy.get('#search-text').clear().type('abc')
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

    cy.intercept('DELETE', getDetail).as('delete')

    cy.waitVisible('table');
    cy.get('table td').contains('abc').parents('tr').find('button').contains('REMOVE').click()
    cy.wait('@delete', timeOut).its('response.statusCode').should('equal', 200)
    cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)
  })
})