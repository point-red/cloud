const apiUrl = Cypress.env('VUE_APP_API_ENDPOINT')
const timeOut = { timeout : 500000 }

export function generateText(length) {
  var result           = ''
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  var charactersLength = characters.length
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function generateNumber(length) {
  var result           = ''
  var characters       = '0123456789'
  var charactersLength = characters.length
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return parseInt(result)
}

export function createDepartement(name) {
  const apiDept = apiUrl + '/human-resource/employee/groups**'
  const urlDept = '/human-resource/employee-group'

  cy.interceptToken()
  cy.intercept('GET', apiDept).as('getDepartement')

  cy.visit(urlDept)

  cy.waitToken()
  cy.wait(2000)
  cy.wait('@getDepartement', timeOut).its('response.statusCode').should('equal', 200)

  cy.waitVisible('#search-text');
  cy.get('#search-text').type(name)
  cy.wait('@getDepartement', timeOut).its('response.statusCode').should('equal', 200)

  let exists = false
  cy.waitVisible('table');
  cy.get('table tr').each(($tr) => {
    if ($tr.find('td').length) {
      exists = true
    }
  }).then(() => {
    if (!exists) {
      cy.waitVisible('.input-group-prepend');
      cy.get('.input-group-prepend').click()
  
      cy.get('.sweet-title', timeOut).should('contain', 'ADD DEPARTMENT')
      cy.get('.sweet-content-content input').eq(0).type(name)
  
      cy.intercept('POST', apiDept).as('createDepartement')
  
      cy.wait(1500)
      cy.get('.sweet-content-content > .pull-right > button').click()
  
      cy.wait('@createDepartement', timeOut).its('response.statusCode').should('equal', 201)
      cy.get('div.vue-notification', timeOut).should('have.class', 'success').and('contain', 'create success')
  
      cy.wait(1500)
      cy.url().should('contain', urlDept)

      cy.wait('@getDepartement', timeOut).its('response.statusCode').should('equal', 200)

    }
  })

  cy.waitVisible('table');
  cy.get('table td').should('contain', name)
}

export function createJobLocation(name) {
  const apiJobLoc = apiUrl + '/human-resource/employee/job-locations**'
  const urlJobLoc = '/human-resource/job-location'

  cy.interceptToken()
  cy.intercept('GET', apiJobLoc).as('getJobLocation')

  cy.visit(urlJobLoc)

  cy.waitToken()
  cy.wait(2000)
  cy.wait('@getJobLocation', timeOut).its('response.statusCode').should('equal', 200)

  cy.waitVisible('#search-text');
  cy.get('#search-text').type(name)
  cy.wait('@getJobLocation', timeOut).its('response.statusCode').should('equal', 200)

  let exists = false
  cy.waitVisible('table');
  cy.get('table tr').each(($tr) => {
    if ($tr.find('td').length) {
      exists = true
    }
  }).then(() => {
    if (! exists) {
      cy.get('.input-group-prepend').click()
  
      cy.get('.sweet-title', timeOut).should('contain', 'ADD JOB LOCATION')
      cy.wait(2000)
      cy.get('.sweet-content-content input').eq(0).type(name)
      cy.get('.sweet-content-content input').eq(1).type('123')
      cy.get('.sweet-content-content input').eq(2).type('123')

      cy.intercept('POST', apiJobLoc).as('createJobLocation')

      cy.get('.sweet-content-content > .pull-right > button').click()

      cy.wait('@createJobLocation', timeOut).its('response.statusCode').should('equal', 201)
      cy.get('div.vue-notification', timeOut).should('have.class', 'success').and('contain', 'create success')

      cy.wait(1500)
      cy.url().should('contain', urlJobLoc)
      cy.wait('@getJobLocation', timeOut).its('response.statusCode').should('equal', 200)
    }
  })

  cy.waitVisible('table');
  cy.get('table td').should('contain', name)
}

export function createEmploymentContract(name) {
  const apiContract = apiUrl + '/human-resource/employee/statuses**'
  const urlContract = '/human-resource/employee-status'

  cy.interceptToken()
  cy.intercept('GET', apiContract).as('getEmploymentContract')

  cy.visit(urlContract)

  cy.waitToken()
  cy.wait(2000)
  cy.wait('@getEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)

  cy.waitVisible('#search-text');
  cy.get('#search-text').type(name)
  cy.wait('@getEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)

  let exists = false
  cy.waitVisible('table');
  cy.get('table tr').each(($tr) => {
    if ($tr.find('td').length) {
      exists = true
    }
  }).then(() => {
    if (! exists) {
      cy.get('.input-group-prepend').click()

      cy.intercept('POST', apiContract).as('createEmploymentContract')

      cy.get('.sweet-title', timeOut).should('contain', 'ADD EMPLOYMENT CONTRACT')
      cy.wait(2000)
      cy.get('.sweet-content-content input').eq(0).type(name)
      cy.wait(1000)
      cy.get('.sweet-content-content > .pull-right > button').click()

      cy.wait('@createEmploymentContract', timeOut).its('response.statusCode').should('equal', 201)
      cy.get('div.vue-notification', timeOut).should('have.class', 'success').and('contain', 'create success')

      cy.wait(1500)
      cy.url().should('contain', urlContract)
      cy.wait('@getEmploymentContract', timeOut).its('response.statusCode').should('equal', 200)
    }
  })

  cy.waitVisible('table');
  cy.get('table td').should('contain', name)
}

export function createEmployee(data) {
  const apiEmployee = apiUrl + '/human-resource/employee/employees**'
  const urlEmployee = '/human-resource/employee'

  cy.interceptToken()
  cy.intercept('GET', apiEmployee).as('getEmployee')

  cy.visit(urlEmployee)

  cy.waitToken()
  cy.wait(2000)
  cy.wait('@getEmployee').its('response.statusCode').should('equal', 200)

  cy.waitVisible('#search-text');
  cy.get('#search-text').type(data.name)
  cy.wait('@getEmployee').its('response.statusCode').should('equal', 200)

  let exists = false
  cy.waitVisible('table');
  cy.get('table tr').each(($tr) => {
    if ($tr.find('td').length) {
      exists = true
    }
  }).then(() => {
    if (! exists) {
      cy.get('.input-group-prepend').click()

    cy.get('.sweet-title', timeOut).should('contain', 'EMPLOYEE INFORMATION')
    cy.wait(1000)
    cy.get('.sweet-content-content input#name').type(data.name)
    cy.wait(1000)
    cy.get('.sweet-content-content input#personal-identity').type(data.personalId)
    cy.wait(1000)
    cy.get('.sweet-content-content input#email').type(data.email)
    cy.wait(1000)
    cy.get('.sweet-content-content input#address').first().type(data.address)
    cy.wait(1000)
    cy.get('.sweet-content-content input#phone').type(data.phone)

    cy.wait(1000)
    cy.get('.sweet-content-content #birth-date input').click()
    cy.wait(1000)
    cy.get('.mx-datepicker-sidebar button').contains('Last Year').click()

    cy.wait(1000)
    cy.get('.sweet-content-content input#birth-place').type(data.address)

    cy.wait(1000)
    cy.get('.sweet-content-content #gender button').click()
    cy.get('.v-dropdown-container.v-dropdown-no-border').each(($el) => {
      if ($el.css('display') != 'none') {
        cy.wrap($el).find('li').first().click()
      }
    })

    cy.wait(1000)
    cy.get('.sweet-content-content #marital-status button').click()
    cy.get('.v-dropdown-container.v-dropdown-no-border').each(($el) => {
      if ($el.css('display') != 'none') {
        cy.wrap($el).find('li').first().click()
      }
    })

    cy.wait(1000)
    cy.get('.sweet-content-content #religion button').click()
    cy.get('.v-dropdown-container.v-dropdown-no-border').each(($el) => {
      if ($el.css('display') != 'none') {
        cy.wrap($el).find('li').first().click()
      }
    })

    cy.wait(1000)
    cy.get('.sweet-content-content #employee-group button').click()
    cy.get('.v-dropdown-container.v-dropdown-no-border').each(($el) => {
      if ($el.css('display') != 'none') {
        cy.wrap($el).find('li').first().click()
      }
    })

    cy.wait(1000)
    cy.get('.sweet-content-content input#code').type(data.code)
    cy.wait(1000)
    cy.get('.sweet-content-content input#job-title').type(data.jobTitle)

    cy.wait(1000)
    cy.get('.sweet-content-content #job-location button').click()
    cy.get('.v-dropdown-container.v-dropdown-no-border').each(($el) => {
      if ($el.css('display') != 'none') {
        cy.wrap($el).find('li').first().click()
      }
    })

    cy.wait(1000)
    cy.get('.sweet-content-content #join-date input').click()
    cy.wait(1000)
    cy.get('.mx-datepicker-sidebar button').contains('Today').click()

    cy.wait(1000)
    cy.get('.sweet-content-content #status button').click()
    cy.get('.v-dropdown-container.v-dropdown-no-border').each(($el) => {
      if ($el.css('display') != 'none') {
        cy.wrap($el).find('li').first().click()
      }
    })

    cy.wait(1000)
    cy.get('.sweet-content-content input#company_email').type(data.email)

    cy.wait(1000)
    cy.get('.sweet-content-content button').contains('Contract Period').click()
    cy.wait(1000)
    cy.get('.sweet-modal').each(($el) => {
      if ($el.find('.sweet-title > h2').text() == 'ADD CONTRACT') {
        cy.wait(1000)
        cy.wrap($el).find('.sweet-content .form-group').eq(0).find('input').click()
        cy.wait(1000)
        cy.get('.mx-datepicker-sidebar button').contains('Last Year').click()

        cy.wait(1000)
        cy.wrap($el).find('.sweet-content .form-group').eq(1).find('input').click()
        cy.wait(1000)
        cy.get('.mx-datepicker-sidebar button').contains('Today').click()

        cy.wait(1000)
        cy.wrap($el).find('.sweet-content .form-group').eq(2).find('input').type(data.note)
        
        cy.wait(1000)
        cy.wrap($el).find('.sweet-content-content > .pull-right > button').last().click()
      }
    })

    cy.wait(1000)
    cy.get('.sweet-content-content button').contains('Employee Assessor').click()
    cy.wait(1000)
    cy.get('.sweet-modal').each(($el) => {
      if ($el.find('.sweet-title > h2').text() == 'ADD SCORER') {
        cy.wait(1000)
        cy.wrap($el).find('.sweet-content .list-group a').first().click()
      }
    })

    cy.wait(1000)
    cy.get('.sweet-content-content #user-account button').click()
    cy.get('.v-dropdown-container.v-dropdown-no-border').each(($el) => {
      if ($el.css('display') != 'none') {
        cy.wrap($el).find('li').first().click()
      }
    })

    cy.wait(1000)
    cy.get('.sweet-modal-overlay').each(($el) => {
      if ($el.css('display') != 'none') {
        cy.wrap($el).find('.sweet-content-content > .pull-right > button').click()
      }
    })

    cy.wait(3000)

    cy.get('div.vue-notification', timeOut).should('have.class', 'success').and('contain', 'create success')

    cy.wait(1500)
    cy.url().should('contain', urlEmployee)
    cy.wait('@getEmployee').its('response.statusCode').should('equal', 200)
    }
  })

  cy.waitVisible('table');
  cy.get('table td').should('contain', data.name)
}

export function createKpiTemplate(name, group = false, indicator = false) {
  const apiTemplate = apiUrl + '/human-resource/kpi/template**'
  const urlTemplate = '/human-resource/kpi-template'

  cy.interceptToken()
  cy.intercept('GET', apiTemplate).as('getTemplate')

  cy.visit(urlTemplate)

  cy.waitToken()
  cy.wait(2000)
  cy.wait('@getTemplate', timeOut).its('response.statusCode').should('equal', 200)

  cy.waitVisible('#search-text');
  cy.get('#search-text').type(name)
  cy.wait('@getTemplate', timeOut).its('response.statusCode').should('equal', 200)

  let exists = false
  cy.waitVisible('table');
  cy.get('table tr').each(($tr) => {
    if ($tr.find('td').length) {
      exists = true
    }
  }).then(() => {
    if (!exists) {
      cy.get('.nav-item > a').should('contain', 'ADD')
      cy.get('.nav-item > a').contains('ADD').click()

      cy.intercept('POST', apiTemplate).as('createKpiTemplate')

      cy.waitVisible('#create')
      cy.get('#create input#name').type(name)
      cy.get('#create [type=submit]').click()

      cy.wait('@createKpiTemplate', timeOut).its('response.statusCode').should('equal', 201)
      cy.get('div.vue-notification', timeOut).should('have.class', 'success').and('contain', 'Create success')
      cy.wait('@getTemplate', timeOut).its('response.statusCode').should('equal', 200)

      cy.waitVisible('table');
      cy.get('table td').should('contain', name)
      if (group && indicator) {
        editKpiTemplate(name, group, indicator)
      }
    } else {
      cy.waitVisible('table');
      cy.get('table td').should('contain', name)
    }
  })
}

export function editKpiTemplate(name, group, indicator) {
  const urlTemplate = '/human-resource/kpi-template'
  const apiTemplate = apiUrl + '/human-resource/kpi/template'
  const getList = apiTemplate + 's**'
  const getDetail = apiTemplate + 's/*'
  
  cy.interceptToken()
  cy.intercept('GET', getList).as('getKpiTemplate')

  cy.visit(urlTemplate)

  cy.waitToken()
  cy.wait(2000)
  cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

  cy.waitVisible('#search-text');
  cy.get('#search-text').clear().type(name)
  cy.wait('@getKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)

  cy.intercept('GET', getDetail).as('getDetailKpiTemplate')

  cy.waitVisible('table');
  cy.get('table td').contains(name).click()

  cy.log('Create group')

  cy.wait('@getDetailKpiTemplate', timeOut).its('response.statusCode').should('equal', 200)
  cy.waitVisible('table');
  cy.get('table td').should('contain', 'NO')
  cy.get('table td').should('contain', 'KEY PERFORMANCE INDICATOR')
  cy.get('table td').should('contain', 'WEIGHT')
  cy.get('table td button').should('contain', 'GROUP')
  cy.wait(1500)
  cy.get('table td button').contains('GROUP').click()

  cy.intercept('POST', apiTemplate + '-groups').as('createKpiTemplateGroups')

  cy.waitVisible('#group')
  cy.get('#group .block-header').should('contain', 'KPI TEMPLATE GROUP')
  cy.get('#group input').type(group)
  cy.wait(2000)
  cy.get('#group [type=submit]').click()

  cy.wait('@createKpiTemplateGroups', timeOut).its('response.statusCode').should('equal', 201)

  cy.get('#group .block-content tr td', timeOut).should('contain', group)
  cy.wait(2000)
  cy.get('#group .modal-footer [type=button]').click()

  cy.wait(2000)
  cy.log('create indicator')
  
  cy.wait(1500)
  cy.get('table td button').contains('INDICATOR').click()

  cy.intercept('POST', apiTemplate + '-indicators').as('createKpiTemplateIndicators')

  cy.waitVisible('#indicator')
  cy.get('#indicator .block-header').should('contain', 'KPI TEMPLATE INDICATOR')
  cy.get('#indicator input#name').type(indicator)
  cy.wait(500)
  cy.get('#indicator input#weight').type(100)
  cy.wait(500)
  cy.get('#indicator input#target').type(80)
  cy.wait(500)
  cy.get('#indicator [type=submit]').click()

  cy.wait('@createKpiTemplateIndicators', timeOut).its('response.statusCode').should('equal', 201)

  cy.get('#indicator .block-content tr td', timeOut).should('contain', indicator)
  cy.wait(2000)
  cy.get('#indicator .modal-footer [type=button]').click()
}