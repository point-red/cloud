describe('Login Test', () => {
  const url = '/'

  beforeEach(() => {
    cy.hideXHR()
  })

  it('Visits the login page', () => {
    cy.visit(url)
    cy.url().should('contain', '/auth/signin')
    cy.get('h1').should('contain', 'Welcome to Point.RED')
  })

  it('Try to login', () => {
    cy.intercept('POST', '**/api/v1/auth/login**').as('getLogin')
    cy.intercept('GET', '**/api/v1/reward/tokens**').as('getToken')
    cy.intercept('POST', '**/api/v1/auth/fetch**').as('authFetch')

    cy.get('#username').type('admin')
    cy.get('#password').type('admin')
    cy.get('button').click()

    cy.wait('@getLogin').its('response.statusCode').should('equal', 200)
    cy.wait('@getToken').its('response.statusCode').should('equal', 200)
    cy.wait('@authFetch').its('response.statusCode').should('equal', 200)

    cy.url().should('contain', url)
    cy.get('p').should('contain', 'MAIN MENU')
  })
})
