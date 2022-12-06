import {
  generateText,
  changeRole,
  createUserNoRole,
} from "../functions";

const name = generateText(7);
const personalId = generateText(7);
const email = generateText(7) + "@mail.com";
const address = generateText(7);
const phone = generateNumber(11);
const code = generateNumber(4);
const jobTitle = generateText(6);
const note = generateText(15);
const url = "/human-resource/employee";
const apiUrl =
  Cypress.env("VUE_APP_API_ENDPOINT") + "/human-resource/employee/employees";
const getList = apiUrl + "**";
const getDetail = apiUrl + "/*";
const timeOut = { timeout: 300000 };

describe("HRIS Employee - Create", () => {
  beforeEach(() => {
    cy.hideXHR();
  });

  it("test have access create", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.visit("/");
    cy.waitToken();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("MAIN MENU").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("HUMAN RESOURCE").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("EMPLOYEE").click();

    cy.intercept("GET", getList).as("getEmployee");
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // table list employee
    cy.waitVisible("table");
    cy.get("table").contains("th", "Name").should("be.visible");

    // button add and form input employee
    cy.waitVisible(".input-group-prepend");

    cy.get(".input-group-prepend").click();
    cy.get(".sweet-modal h2", timeOut).should("contain", "EMPLOYEE INFORMATION");

    cy.get(".sweet-title", timeOut).should("contain", "EMPLOYEE INFORMATION");
    cy.get(".sweet-content-content input#name", timeOut).should("be.visible");
    cy.get(".sweet-content-content input#personal-identity", timeOut).should("be.visible");
    cy.get(".sweet-content-content input#email", timeOut).should("be.visible");
    cy.get(".sweet-content-content input#address", timeOut).should("be.visible");
    cy.get(".sweet-content-content input#phone", timeOut).should("be.visible");
    cy.get(".sweet-content-content #birth-date input", timeOut).should("be.visible");
    cy.get(".sweet-content-content mx-datepicker-sidebar button", timeOut).should("be.visible");
    cy.get(".sweet-content-content input#birth-place", timeOut).should("be.visible");
    cy.get(".sweet-content-content #gender button", timeOut).should("be.visible");
    cy.get(".sweet-content-content #marital-status button", timeOut).should("be.visible");
    cy.get(".sweet-content-content #religion button", timeOut).should("be.visible");
    cy.get(".sweet-content-content #employee-group button", timeOut).should("be.visible");
    cy.get(".sweet-content-content input#code", timeOut).should("be.visible");
    cy.get(".sweet-content-content input#job-title", timeOut).should("be.visible");
    cy.get(".sweet-content-content #job-location button", timeOut).should("be.visible");
    cy.get(".sweet-content-content #join-date input", timeOut).should("be.visible");
    cy.get(".sweet-content-content #status button", timeOut).should("be.visible");
    cy.get(".sweet-content-content input#company_email", timeOut).should("be.visible");
    cy.get(".sweet-content-content button", timeOut).should("contain", "Contract Period");
    cy.get(".sweet-content-content button", timeOut).should("contain", "Employee Assessor");

    // address input
    cy.wait(3000)
    cy.get(".sweet-content-content input#address", timeOut)
      .parents('.form-group.row')
      .find('i')
      .click()

    cy.get(".sweet-content-content input#address", timeOut).should("have.length", 2);

    cy.get(".sweet-content-content input#address", timeOut)
      .first()
      .parents('.form-group.row')
      .find('i')
      .click()

    // social media
    cy.wait(3000);
    cy.get(".sweet-content-content button")
      .contains("Social Media")
      .click();
    cy.wait(1000);
    cy.get(".sweet-modal").each(($el) => {
      if ($el.find(".sweet-title > h2").text() == "ADD SOCIAL MEDIA") {
        cy.wait(1000);
        cy.get('#social-media-type').click();
        cy.get(".v-dropdown-container.v-dropdown-no-border").each(($elm) => {
          if ($elm.css("display") != "none") {
            cy.wrap($elm).find("li").should("contain", "Facebook");
            cy.wrap($elm).find("li").should("contain", "Twitter");
            cy.wrap($elm).find("li").should("contain", "Instagram");
          }
        });
        $el.find('.sweet-action-close').click()
      }
    });

    // input and save employee
    cy.wait(1000);
    cy.get(".sweet-content-content input#name").type(data.name);
    cy.wait(1000);
    cy.get(".sweet-content-content input#personal-identity").type(
      data.personalId
    );
    cy.wait(1000);
    cy.get(".sweet-content-content input#email").type(data.email);
    cy.wait(1000);
    cy.get(".sweet-content-content input#address")
      .first()
      .type(data.address);
    cy.wait(1000);
    cy.get(".sweet-content-content input#phone").type(data.phone);

    cy.wait(1000);
    cy.get(".sweet-content-content #birth-date input").click();
    cy.wait(1000);
    cy.get(".mx-datepicker-sidebar button").contains("Last Year").click();

    cy.wait(1000);
    cy.get(".sweet-content-content input#birth-place").type(data.address);

    cy.wait(1000);
    cy.get(".sweet-content-content #gender button").click();
    cy.get(".v-dropdown-container.v-dropdown-no-border").each(($el) => {
      if ($el.css("display") != "none") {
        cy.wrap($el).find("li").first().click();
      }
    });

    cy.wait(1000);
    cy.get(".sweet-content-content #marital-status button").click();
    cy.get(".v-dropdown-container.v-dropdown-no-border").each(($el) => {
      if ($el.css("display") != "none") {
        cy.wrap($el).find("li").first().click();
      }
    });

    cy.wait(1000);
    cy.get(".sweet-content-content #religion button").click();
    cy.get(".v-dropdown-container.v-dropdown-no-border").each(($el) => {
      if ($el.css("display") != "none") {
        cy.wrap($el).find("li").first().click();
      }
    });

    cy.wait(1000);
    cy.get(".sweet-content-content #employee-group button").click();
    cy.get(".v-dropdown-container.v-dropdown-no-border").each(($el) => {
      if ($el.css("display") != "none") {
        cy.wrap($el).find("li").first().click();
      }
    });

    cy.wait(1000);
    cy.get(".sweet-content-content input#code").type(data.code);
    cy.wait(1000);
    cy.get(".sweet-content-content input#job-title").type(data.jobTitle);

    cy.wait(1000);
    cy.get(".sweet-content-content #job-location button").click();
    cy.get(".v-dropdown-container.v-dropdown-no-border").each(($el) => {
      if ($el.css("display") != "none") {
        cy.wrap($el).find("li").first().click();
      }
    });

    cy.wait(1000);
    cy.get(".sweet-content-content #join-date input").click();
    cy.wait(1000);
    cy.get(".mx-datepicker-sidebar button").contains("Today").click();

    cy.wait(1000);
    cy.get(".sweet-content-content #status button").click();
    cy.get(".v-dropdown-container.v-dropdown-no-border").each(($el) => {
      if ($el.css("display") != "none") {
        cy.wrap($el).find("li").first().click();
      }
    });

    cy.wait(1000);
    cy.get(".sweet-content-content input#company_email").type(data.email);

    cy.wait(1000);
    cy.get(".sweet-content-content button")
      .contains("Contract Period")
      .click();
    cy.wait(1000);
    cy.get(".sweet-modal").each(($el) => {
      if ($el.find(".sweet-title > h2").text() == "ADD CONTRACT") {
        cy.wait(1000);
        cy.wrap($el)
          .find(".sweet-content .form-group")
          .eq(0)
          .find("input")
          .click();
        cy.wait(1000);
        cy.get(".mx-datepicker-sidebar button")
          .contains("Last Year")
          .click();

        cy.wait(1000);
        cy.wrap($el)
          .find(".sweet-content .form-group")
          .eq(1)
          .find("input")
          .click();
        cy.wait(1000);
        cy.get(".mx-datepicker-sidebar button").contains("Today").click();

        cy.wait(1000);
        cy.wrap($el)
          .find(".sweet-content .form-group")
          .eq(2)
          .find("input")
          .type(data.note);

        cy.wait(1000);
        cy.wrap($el)
          .find(".sweet-content-content > .pull-right > button")
          .last()
          .click();
      }
    });

    cy.wait(1000);
    cy.get(".sweet-content-content button")
      .contains("Employee Assessor")
      .click();
    cy.wait(1000);
    cy.get(".sweet-modal").each(($el) => {
      if ($el.find(".sweet-title > h2").text() == "ADD SCORER") {
        cy.wait(1000);
        cy.wrap($el).find(".sweet-content .list-group a").first().click();
      }
    });

    cy.wait(1000);
    cy.get(".sweet-content-content #user-account button").click();
    cy.get(".v-dropdown-container.v-dropdown-no-border").each(($el) => {
      if ($el.css("display") != "none") {
        cy.wrap($el).find("li").first().click();
      }
    });

    cy.wait(1000);
    cy.get(".sweet-modal-overlay").each(($el) => {
      if ($el.css("display") != "none") {
        cy.wrap($el)
          .find(".sweet-content-content > .pull-right > button")
          .click();
      }
    });

    cy.wait(3000);

    cy.get("div.vue-notification", timeOut)
      .should("have.class", "success")
      .and("contain", "create success");

    cy.wait(1500);
    cy.url().should("contain", urlEmployee);
    cy.wait("@getEmployee").its("response.statusCode").should("equal", 200);

    // find name
    cy.waitVisible("table");
    cy.get("table").contains("th", "Name").should("be.visible");

    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // detail name
    cy.intercept("GET", getDetail).as("getDetailEmployee");
    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a").contains(name).click();
    cy.wait("@getDetailEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);
  });

  it("test user no role - pagination", () => {
    // login
    cy.then(function () {
      if (this.userName) {
        cy.login(this.userName, this.userName + this.userName);
      } else {
        createUserNoRole();
      }
    });

    cy.interceptToken();
    cy.intercept("GET", getList).as("getEmployee");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get('.pagination [class="page-item"]').last().click();
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);
  });

  it("test user no role - see number", () => {
    // login
    cy.then(function () {
      if (this.userName) {
        cy.login(this.userName, this.userName + this.userName);
      } else {
        createUserNoRole();
      }
    });

    cy.interceptToken();
    cy.intercept("GET", getList).as("getEmployee");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("tbody th")
      .first()
      .invoke("text")
      .should("match", /^[0-9]*$/);
  });

  it("test user no role - not show button add", () => {
    // login
    cy.then(function () {
      if (this.userName) {
        cy.login(this.userName, this.userName + this.userName);
      } else {
        createUserNoRole();
      }
    });

    cy.interceptToken();
    cy.intercept("GET", getList).as("getEmployee");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get(".input-group-prepend").should("not.exist");
  });

  it("test user has role - empty input and save", () => {
    // login
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getEmployee");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.waitVisible(".input-group-prepend");
    cy.get(".input-group-prepend").click();

    // fill input and save
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.get(".sweet-modal button").contains("SAVE").click();

    // Error save
    cy.get("div.vue-notification", timeOut)
      .should("have.class", "danger")
      .and("contain", "The name field is required");
  });

  it("test user has role - duplicate name", () => {
    // login
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getEmployee");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.waitVisible(".input-group-prepend");
    cy.get(".input-group-prepend").click();

    // fill input and save
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.get('.sweet-modal input#name', timeOut).type(name);
    cy.get(".sweet-modal button").contains("SAVE").click();

    // Error save
    cy.get("div.vue-notification", timeOut)
      .should("have.class", "danger")
      .and("contain", "Integrity constraint violation: 1062 Duplicate entry");
  });

  it("test user has role - input more than 255 and save", () => {
    // login
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getEmployee");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.waitVisible(".input-group-prepend");
    cy.get(".input-group-prepend").click();

    // fill input and save
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.get('.sweet-modal input#name', timeOut).type(generateText(256));
    cy.get(".sweet-modal button").contains("SAVE").click();

    // Error save
    cy.get("div.vue-notification", timeOut)
      .should("have.class", "danger")
      .and("contain", "The name may not be greater than 255 characters");
  });
});

describe("HRIS Employee - Read", () => {
  beforeEach(() => {
    cy.hideXHR();
  });

  it("test have access read", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.visit("/");
    cy.waitToken();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("MAIN MENU").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("HUMAN RESOURCE").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("EMPLOYEE").click();

    cy.intercept("GET", getList).as("getEmployee");
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // table list employee
    cy.waitVisible("table");
    cy.get("table").contains("th", "Name").should("be.visible");
  });

  it("test have access read - pagination, (detail) button:create,edit,delete", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.visit("/");
    cy.waitToken();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("MAIN MENU").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("HUMAN RESOURCE").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("EMPLOYEE").click();

    cy.intercept("GET", getList).as("getEmployee");
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // list pagination
    cy.waitVisible(".pagination");

    // find name
    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // see detail name
    cy.intercept("GET", getDetail).as("getDetailEmployee");
    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a").contains(name).click();
    cy.wait("@getDetailEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.get('[type="button"]').should("contain", "CREATE");
    cy.get('[type="button"]').should("contain", "EDIT");
    cy.get('[type="button"]').should("contain", "DELETE");
  });

  it("test have access read - detail, name column", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.visit("/");
    cy.waitToken();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("MAIN MENU").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("HUMAN RESOURCE").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("EMPLOYEE").click();

    cy.intercept("GET", getList).as("getEmployee");
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // find name
    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // see detail name
    cy.intercept("GET", getDetail).as("getDetailEmployee");
    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a").contains(name).click();
    cy.wait("@getDetailEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // name column
    cy.get('.block-content input[name="name"]').should("be.visible");
  });

  it("test have access read - archive", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getEmployee");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");

    // find name
    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get(".css-checkbox").last().click()
    cy.get('button').contains('ARCHIVE').click()

    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.get("#search-text").type(name);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);
    cy.get("table").contains("th", "Name").should("not.exist");
  });

  it("test have access read - active ", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getEmployee");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get('a').contains('ADVANCE FILTER').click()
    cy.get('.select-link').click()
    cy.get(".sweet-modal-overlay").each(($el) => {
      if ($el.css("display") != "none") {
        cy.wrap($el)
          .find("a")
          .contains('ARCHIVED')
          .click();
      }
    });

    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // find name
    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get(".css-checkbox").last().click()
    cy.get('button').contains('ACTIVATE').click()

    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get('a').contains('ADVANCE FILTER').click()
    cy.get('.select-link').click()
    cy.get(".sweet-modal-overlay").each(($el) => {
      if ($el.css("display") != "none") {
        cy.wrap($el)
          .find("a")
          .contains('ARCHIVED')
          .click();
      }
    });

    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.get("#search-text").type(name);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);
    cy.get("table").contains("th", "Name").should("not.exist");
  });
});

describe("HRIS Employee - Edit", () => {
  beforeEach(() => {
    cy.hideXHR();
  });

  it("test have access edit", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.visit("/");
    cy.waitToken();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("MAIN MENU").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("HUMAN RESOURCE").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("EMPLOYEE").click();

    cy.intercept("GET", getList).as("getEmployee");
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // table list employee
    cy.waitVisible("table");
    cy.get("table").contains("th", "Name").should("be.visible");
  });

  it("test have access edit - detail, name column", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.visit("/");
    cy.waitToken();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("MAIN MENU").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("HUMAN RESOURCE").click();

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("EMPLOYEE").click();

    cy.intercept("GET", getList).as("getEmployee");
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // find name
    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // see detail name
    cy.intercept("GET", getDetail).as("getDetailEmployee");
    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a").contains(name).click();
    cy.wait("@getDetailEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.get("input#name", timeOut).should("have.value", name);
    cy.get('[type="button"]').contains("EDIT").click();

    cy.waitVisible(".sweet-title");
    cy.get(".sweet-title").should("contain", "EDIT DEPARTMENT");

    cy.wait("@getDetailEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible(".sweet-content-content button").last().should("be.visible"); // button update
    cy.waitVisible(".sweet-modal .sweet-action-close"); // button close

    cy.wait(2000);
    cy.get('.sweet-content-content input[name="name"]')
      .last()
      .clear()
      .type(name + " - edit");

    cy.wait(1500);
    cy.intercept("PATCH", getDetail).as("updateEmployee");
    cy.get(".sweet-content-content button").last().click();

    cy.wait("@updateEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);
    cy.get("div.vue-notification", timeOut)
      .should("have.class", "success")
      .and("contain", "update success");
  });

  it("test have access edit - empty input and save", () => {
    // login
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getEmployee");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.waitVisible(".input-group-prepend");
    cy.get(".input-group-prepend").click();

    // clear input and save
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.get('.sweet-modal input#name', timeOut).clear();
    cy.get(".sweet-modal button").contains("SAVE").click();

    // Error save
    cy.get("div.vue-notification", timeOut)
      .should("have.class", "danger")
      .and("contain", "The name field is required");

    // fill same input and save
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.get('.sweet-modal input#name', timeOut).type(name + " - edit");
    cy.get(".sweet-modal button").contains("SAVE").click();

    // Error save
    cy.get("div.vue-notification", timeOut)
      .should("have.class", "danger")
      .and("contain", "Please edit with a different name");
  });

  it("test user has role - input more than 255 and save", () => {
    // login
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getEmployee");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getEmployee", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.waitVisible(".input-group-prepend");
    cy.get(".input-group-prepend").click();

    // fill input and save
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.get('.sweet-modal input#name', timeOut).type(generateText(256));
    cy.get(".sweet-modal button").contains("SAVE").click();

    // Error save
    cy.get("div.vue-notification", timeOut)
      .should("have.class", "danger")
      .and("contain", "The name may not be greater than 255 characters");
  });
});

describe("HRIS Employee - Delete", () => {
  beforeEach(() => {
    cy.hideXHR();
  });

  it("test have access delete", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getEmployee");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getEmployee").its("response.statusCode").should("equal", 200);

    // table list employee
    cy.waitVisible("table");
    cy.get("table").contains("th", "Name").should("be.visible");

    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getEmployee").its("response.statusCode").should("equal", 200);

    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a")
      .contains(name + " - edit")
      .click();

    cy.get("input#name", timeOut).should("have.value", name + " - edit");
    cy.get(".block-content").contains("DELETE").click();

    cy.intercept("DELETE", getDetail).as("deleteDepartemen");

    cy.waitVisible(".swal2-container");
    cy.get(".swal2-container button").contains("Confirm").click();

    cy.wait("@deleteDepartemen", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.wait(1500);
    cy.url().should("contain", url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getEmployee").its("response.statusCode").should("equal", 200);

    cy.waitVisible("table");
    cy.get("table").contains("th", "Name").should("be.visible");
  });
});
