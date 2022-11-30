const { should } = require('chai')
const { iteratee } = require('lodash')
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

  it('Access to purchase receive with DONE status', () => {
    cy.interceptToken()
    cy.visit('purchase/receive/')
    cy.waitToken()

    cy.waitVisible('#main-container > .content')

    cy.waitVisible('tbody > tr')
    cy.get('tbody > tr')
      .find('td')
      .each(($element) => {
        cy.wrap($element).invoke('text').then(text => {
          if (text.includes('DONE')) {
            cy.wrap($element).siblings('th').children('a').click()
            cy.waitVisible('#main-container > .content')
          }
        })
      })
  })

  it('Access purchase receive without default branch or the same branch with receive owner', () => {
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
  })

  it('When user click DELETE receive ask them to input reason', () => {
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
  })

  it.only('User have inputted reason when click DELETE', () => {
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
  })
})
