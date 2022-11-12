import { generateText, createDepartement } from '../functions'
import * as hrFunctions from '../functions'

const { should } = require("chai")
const randomString = generateText(7)
const url = '/human-resource/kpi/kpi-assessment'
const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT')
const apiEmployee = apiUrl + '/human-resource/employee/employees'
const listEmployee = apiEmployee + '**'
const getEmployee = apiEmployee + '/*'
const apiAssignAssessment = getEmployee + '*/**'
const apiTemplate = apiUrl + '/human-resource/kpi/templates**'
const timeOut = { timeout : 300000 }

const fileName = 'example.pdf'

const departmentName = 'Departemen Name'
const jobLocation = 'Surabaya'
const employmentContract = 'Kontrak 1'
const employeeName = 'John Doe'
const kpiTemplateName = 'Template 1'
const kpiTemplateGroup = 'Template Group 1'
const kpiTemplateIndicator = 'Template Indicator 1'

describe('KPI Assessement - Index', () => {
  beforeEach(() => {
    cy.hideXHR()
    cy.login('admin', 'admin')
  })

  it('Create Departemen', () => {
    hrFunctions.createDepartement(departmentName)
  })

  it('Create Job location', () => {
    hrFunctions.createJobLocation(jobLocation)
  })

  it('Create Employment Contract', () => {
    hrFunctions.createEmploymentContract(employmentContract)
  })

  it('Create Employment', () => {
    hrFunctions.createEmployee({
      name: employeeName,
      personalId: 'A001',
      email: 'john.doe@mail.com',
      address: 'Lorem Ipsum',
      phone: '08123456789',
      code: '121314',
      jobTitle: 'HR',
      note: 'call my name JD'
    })
  })

  it('Create and Edit KPI Template', () => {
    hrFunctions.createKpiTemplate(kpiTemplateName, kpiTemplateGroup, kpiTemplateIndicator)
  })

  it('Index KPI Assessement', () => {
    cy.interceptToken()
    cy.visit('/')
    cy.waitToken()

    cy.waitVisible('#main-container > .content');
    cy.get('#main-container > .content > .row > div > div > a').contains('MAIN MENU').click()

    cy.waitVisible('#main-container > .content');
    cy.get('#main-container > .content > .row > div > div > a').contains('HUMAN RESOURCE').click()

    cy.waitVisible('#main-container > .content');
    cy.get('#main-container > .content > div > .row > div > div > a').contains('KPI').click()
  
    cy.intercept('GET', listEmployee).as('getEmployee')

    cy.waitVisible('#main-container > .content');
    cy.get('#main-container > .content > div > .row > div > div > a').contains('KPI ASSESSMENT').click()

    cy.wait('@getEmployee', timeOut).its('response.statusCode').should('equal', 200)
    cy.url().should('contain', url)

    cy.waitVisible('table');
    cy.get('table th').should('contain', 'name')
    cy.get('table th').should('contain', 'job title')
    cy.get('table th').should('contain', 'department')
    cy.get('table th').should('contain', 'action')

    cy.waitVisible('#search-text');
    cy.get('#search-text').type(employeeName)
    cy.wait('@getEmployee').its('response.statusCode').should('equal', 200)

    cy.get('table td').should('contain', employeeName)
  })

  it('Create KPI Assessement', () => {
    cy.interceptToken()
    cy.intercept('GET', listEmployee).as('getEmployee')

    cy.visit(url)

    cy.waitToken()
    cy.wait(2000)
    cy.wait('@getEmployee', timeOut).its('response.statusCode').should('equal', 200)

    cy.waitVisible('#search-text');
    cy.get('#search-text').type(employeeName)
    cy.wait('@getEmployee', timeOut).its('response.statusCode').should('equal', 200)

    cy.intercept('GET', getEmployee).as('getDetailEmployee')
    cy.waitVisible('table');
    cy.get('table td').contains(employeeName).parents('tr').find('a').first().click()

    cy.wait('@getDetailEmployee', timeOut).its('response.statusCode').should('equal', 200)

    cy.intercept('GET', apiTemplate).as('getTemplate')

    cy.waitVisible('#assign-assessment-modal')
    cy.get('#assign-assessment-modal .block-title').should('contain', 'ASSIGN KPI TEMPLATE')
    cy.get('#assign-assessment-modal #search-text').type(kpiTemplateName)

    cy.wait('@getTemplate', timeOut).its('response.statusCode').should('equal', 200)
    cy.waitVisible('#assign-assessment-modal .list-group')
    cy.get('#assign-assessment-modal .list-group a:first-child').click()

    cy.intercept('POST', apiAssignAssessment).as('assignAssessment')

    cy.wait(1000)
    cy.get('#assign-assessment-modal [type=submit]').click()

    cy.wait('@assignAssessment', timeOut).its('response.statusCode').should('equal', 200)

    cy.get('form.row > .col-sm-12').find('h3', timeOut).shoul('contain', 'ASSESSMENT')
    cy.get('form.row > .col-sm-12 div.col-form-label', timeOut).first().shoul('contain', employeeName)
    cy.get('form.row > .col-sm-12 div.col-form-label', timeOut).eq(1).shoul('contain', kpiTemplateName)

    cy.get('form.row > .col-sm-12 .table-responsive tbody tr:first-child td:first-child').should('contain', kpiTemplateGroup)
    cy.get('form.row > .col-sm-12 .table-responsive tbody tr:nth-child(2) td:nth-child(2)').should('contain', kpiTemplateIndicator)

    cy.get('form.row > .col-sm-12 .table-responsive tbody tr:nth-child(2) td:nth-child(5) a:first-child').click()
    cy.waitVisible('#assign-notes')
    cy.get('#assign-comment h3').should('contain','NOTES ASSESSMENT')
    cy.get('#assign-notes textarea').type('note assessment')
    cy.get('#assign-notes button[type=submit]').click()
    cy.get('form.row > .col-sm-12 .table-responsive tbody tr:nth-child(2) td:nth-child(5) a:nth-child(2)', timeOut).should('be.visible')

    cy.get('form.row > .col-sm-12 input[type=file]').attachFile(fileName)
    cy.get('form.row > .col-sm-12 input[type=file]').parent().find('label').contains(fileName)

    cy.get('form.row > .col-sm-12 .table-responsive tbody tr:nth-child(2) td:last-child a:first-child').click()
    cy.waitVisible('#assign-comment')
    cy.get('#assign-comment h3').should('contain','COMMENT ASSESSMENT')
    cy.get('#assign-comment textarea').type('comment assessment')
    cy.get('#assign-comment button[type=submit]').click()

    cy.get('.block-content-inner > div:last-child button').contains('SAVE').click()

    cy.get('#main-container .content .block nav .active', timeOut).should('contain', 'HISTORY ASSESSMENT')

    cy.get('.table-responsive table thead tr td:nth-child(2)').should('contain', 'kpi template')
    cy.get('.table-responsive table tbody tr:first-child td:nth-child(2)').should('contain', kpiTemplateName)
  })
})