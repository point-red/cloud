// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT')

//  -- This is will hide request some xhr --
Cypress.Commands.add('hideXHR', () => {
  Cypress.on("log:added", ev => {
    if (["xhr", "other", "new url"].includes(ev.displayName)) {
      const el = Array.from(
        window.top.document.querySelectorAll(".command-wrapper")
      ).slice(-1)[0]
      if (el) {
        el.parentElement.style.display = "none"
      }
    }
  })
})

Cypress.Commands.add('login', (username, password) => {
  cy.request({
    method: 'POST',
    url: apiUrl + '/auth/login',
    body: {
      username: username,
      password: password
    }
  }).then(({ body }) => {
    cy.setCookie('TED', 'Undefined') 
    cy.setCookie('TTT', 'Bearer') 
    cy.setCookie('TAT', body.data.access_token) 
    cy.setCookie('TID', body.data.token_id) 
  })
})

Cypress.Commands.add('interceptToken', () => {
  cy.intercept('GET', apiUrl + '/reward/tokens**').as('getToken')
  cy.intercept('POST', apiUrl + '/auth/fetch**').as('authFetch')
})

Cypress.Commands.add('waitToken', () => {
  const timeOut = { timeout: 300000 }

  cy.wait('@getToken', timeOut).its('response.statusCode').should('equal', 200)
  cy.wait('@authFetch', timeOut).its('response.statusCode').should('equal', 200)
})

Cypress.Commands.add('waitVisible', (target, idx) => {
  const timeOut = { timeout: 300000 }
  if (idx) {
    cy.get(target).eq(idx, timeOut).should('be.visible');
  } else {
    cy.get(target, timeOut).should('be.visible');
  }
  cy.wait(2000)
})
