const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT')
const timeOut = { timeout: 500000 }

export function generateText (length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function generateNumber (length) {
  var result = ''
  var characters = '0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return parseInt(result)
}

export function createRole (name) {
  const apiDept = apiUrl + '/master/roles**'
  const urlDept = '/master/role'

  cy.interceptToken()
  cy.intercept('GET', apiDept).as('getRole')

  cy.visit(urlDept)

  cy.waitToken()
  cy.wait(2000)
  cy.wait('@getRole', timeOut).its('response.statusCode').should('equal', 200)

  cy.waitVisible('#search-text')
  cy.get('#search-text').type(name)
  cy.wait('@getRole', timeOut).its('response.statusCode').should('equal', 200)

  let exists = false
  cy.waitVisible('table')
  cy.get('table tr').each(($tr) => {
    if ($tr.find('td').length) {
      exists = true
    }
  }).then(() => {
    if (!exists) {
      cy.waitVisible('.input-group-prepend')
      cy.get('.input-group-prepend').click()

      cy.get('.sweet-title', timeOut).should('contain', 'ADD ROLE')
      cy.get('.sweet-content-content input').eq(0).type(name)

      cy.intercept('POST', apiDept).as('createRole')

      cy.wait(1500)
      cy.get('.sweet-content-content > .pull-right > button').click()

      cy.wait('@createRole', timeOut).its('response.statusCode').should('equal', 201)
      cy.get('div.vue-notification', timeOut).should('have.class', 'success').and('contain', 'create success')

      cy.wait(1500)
      cy.url().should('contain', urlDept)

      cy.wait('@getRole', timeOut).its('response.statusCode').should('equal', 200)
    }
  })

  cy.waitVisible('table')
  cy.get('table td').should('contain', name)

  cy.get('table td a').should('contain', name).eq(0).click()

  cy.wait(1500)
  cy.get('.nav').find('a').contains('PURCHASING').should('be.visible').click()

  cy.waitVisible('table')
  cy.get('table tr').should('contain', 'PURCHASE RECEIVE').should('contain', 'CREATE')
}

export function createPurchaseReceive (name) {
  const apiDept = apiUrl + '/purchase/receives**'
  const urlDept = '/purchase/receive'

  cy.interceptToken()
  cy.intercept('GET', apiDept).as('getPurchaseReceive')

  cy.visit(urlDept)

  cy.waitToken()
  cy.wait(2000)
  cy.wait('@getPurchaseReceive', timeOut).its('response.statusCode').should('equal', 200)
}

export function removeRole () {

}
