import {
  generateText,
  changeRole,
  createUserNoRole,
  createDepartementApi,
} from "../functions";

const randomString = generateText(7);
const name = randomString;
const url = "/human-resource/employee-group";
const api = Cypress.env("VUE_APP_API_ENDPOINT");
const apiUrl = api + "/human-resource/employee/groups";
const getList = apiUrl + "**";
const getDetail = apiUrl + "/*";
const timeOut = { timeout: 300000 };

describe("HRIS Departemen - Create", () => {
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

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("DEPARTMENT").click();

    cy.intercept("GET", getList).as("getDepartement");
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // table list departement
    cy.waitVisible("table");
    cy.get("table").contains("th", "Name").should("be.visible");

    // button add and form input departemen
    cy.waitVisible(".input-group-prepend");
    cy.get(".input-group-prepend").click();
    cy.get(".sweet-modal h2", timeOut).should("contain", "ADD DEPARTMENT");
    cy.get('.sweet-modal [for="name"]').should("contain", "NAME");
    cy.get('.sweet-modal input[id="name"]').should("be.visible");

    // input and save departement
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.intercept("POST", getList).as("createDepartement");
    cy.get('.sweet-modal input[id="name"]', timeOut).type(name);
    cy.get(".sweet-modal button").contains("SAVE").click();
    cy.wait("@createDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 201);

    cy.get("div.vue-notification", timeOut)
      .should("have.class", "success")
      .and("contain", "create success");

    // find name
    cy.waitVisible("table");
    cy.get("table").contains("th", "Name").should("be.visible");

    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // detail name
    cy.intercept("GET", getDetail).as("getDetailDepartement");
    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a").contains(name).click();
    cy.wait("@getDetailDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);
  });

  it("create data if data table < 10", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.get('.pagination [class="page-item"]').then(($pagination) => {
      if ($pagination.length <= 3) {
        createDepartementApi();
      }
    });
  });

  it("test user no role - list 10 of data", () => {
    // login
    cy.then(function () {
      if (this.userName) {
        cy.login(this.userName, this.userName + this.userName);
      } else {
        createUserNoRole();
      }
    });

    cy.interceptToken();
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("tbody th").should("have.length", 10);
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
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get('.pagination [class="page-item"]').last().click();
    cy.wait("@getDepartement", timeOut)
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
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement", timeOut)
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
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get(".input-group-prepend").should("not.exist");
  });

  it("test user has role - empty input and save", () => {
    // login
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.waitVisible(".input-group-prepend");
    cy.get(".input-group-prepend").click();

    // fill input and save
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.get('.sweet-modal input[id="name"]', timeOut).type(name);
    cy.get(".sweet-modal button").contains("SAVE").click();

    // Error save
    cy.get("div.vue-notification", timeOut)
      .should("have.class", "danger")
      .and("contain", "The name field is required");
  });

  it("test user has role - input more than 255 and save", () => {
    // login
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.waitVisible(".input-group-prepend");
    cy.get(".input-group-prepend").click();

    // fill input and save
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.get('.sweet-modal input[id="name"]', timeOut).type(generateText(256));
    cy.get(".sweet-modal button").contains("SAVE").click();

    // Error save
    cy.get("div.vue-notification", timeOut)
      .should("have.class", "danger")
      .and("contain", "The name may not be greater than 255 characters");
  });
});

describe("HRIS Departemen - Read", () => {
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

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("DEPARTMENT").click();

    cy.intercept("GET", getList).as("getDepartement");
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // table list departement
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

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("DEPARTMENT").click();

    cy.intercept("GET", getList).as("getDepartement");
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // list pagination
    cy.waitVisible(".pagination");

    // find name
    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // see detail name
    cy.intercept("GET", getDetail).as("getDetailDepartement");
    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a").contains(name).click();
    cy.wait("@getDetailDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.get('[type="button"]').should("contain", "CREATE");
    cy.get('[type="button"]').should("contain", "EDIT");
    cy.get('[type="button"]').should("contain", "DELETE");
  });

  it("test have access read - list 10 of data", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("tbody th").should("have.length", 10);
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

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("DEPARTMENT").click();

    cy.intercept("GET", getList).as("getDepartement");
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // find name
    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // see detail name
    cy.intercept("GET", getDetail).as("getDetailDepartement");
    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a").contains(name).click();
    cy.wait("@getDetailDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // name column
    cy.get('.block-content input[name="name"]').should("be.visible");
  });

  it("test have access read  - pagination", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get('.pagination [class="page-item"]').last().click();
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.waitVisible(".input-group-prepend"); // button create
    cy.waitVisible("#search-text"); // search
    cy.waitVisible(".pagination"); // pagination
  });
});

describe("HRIS Departemen - Edit", () => {
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

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("DEPARTMENT").click();

    cy.intercept("GET", getList).as("getDepartement");
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // table list departement
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

    cy.waitVisible("#main-container > .content");
    cy.get('#main-container a[href*="/"]').contains("DEPARTMENT").click();

    cy.intercept("GET", getList).as("getDepartement");
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // find name
    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // see detail name
    cy.intercept("GET", getDetail).as("getDetailDepartement");
    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a").contains(name).click();
    cy.wait("@getDetailDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.get("input#name", timeOut).should("have.value", randomString);
    cy.get('[type="button"]').contains("EDIT").click();

    cy.waitVisible(".sweet-title");
    cy.get(".sweet-title").should("contain", "EDIT DEPARTMENT");

    cy.wait("@getDetailDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible(".sweet-content-content button").last().should("be.visible"); // button update
    cy.waitVisible(".sweet-modal .sweet-action-close"); // button close

    cy.wait(2000);
    cy.get('.sweet-content-content input[name="name"]')
      .last()
      .clear()
      .type(randomString + " - edit");

    cy.wait(1500);
    cy.intercept("PATCH", getDetail).as("updateDepartement");
    cy.get(".sweet-content-content button").last().click();

    cy.wait("@updateDepartement", timeOut)
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
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.waitVisible(".input-group-prepend");
    cy.get(".input-group-prepend").click();

    // clear input and save
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.get('.sweet-modal input[id="name"]', timeOut).clear();
    cy.get(".sweet-modal button").contains("SAVE").click();

    // Error save
    cy.get("div.vue-notification", timeOut)
      .should("have.class", "danger")
      .and("contain", "The name field is required");

    // fill same input and save
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.get('.sweet-modal input[id="name"]', timeOut).type(name);
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
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.waitVisible(".input-group-prepend");
    cy.get(".input-group-prepend").click();

    // fill input and save
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.get('.sweet-modal input[id="name"]', timeOut).type(generateText(256));
    cy.get(".sweet-modal button").contains("SAVE").click();

    // Error save
    cy.get("div.vue-notification", timeOut)
      .should("have.class", "danger")
      .and("contain", "The name may not be greater than 255 characters");
  });
});

describe("HRIS Departemen - Delete", () => {
  beforeEach(() => {
    cy.hideXHR();
  });

  it("test have access delete", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement").its("response.statusCode").should("equal", 200);

    // table list departement
    cy.waitVisible("table");
    cy.get("table").contains("th", "Name").should("be.visible");

    cy.waitVisible("#search-text");
    cy.get("#search-text").type(randomString);
    cy.wait("@getDepartement").its("response.statusCode").should("equal", 200);

    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a")
      .contains(randomString + " - edit")
      .click();

    cy.get("input#name", timeOut).should(
      "have.value",
      randomString + " - edit"
    );
    cy.get(".block-content").contains("DELETE").click();

    cy.intercept("DELETE", getDetail).as("deleteDepartemen");

    cy.waitVisible(".swal2-container");
    cy.get(".swal2-container button").contains("Confirm").click();

    cy.wait("@deleteDepartemen", timeOut)
      .its("response.statusCode")
      .should("equal", 204);

    cy.wait(1500);
    cy.url().should("contain", url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement").its("response.statusCode").should("equal", 200);

    cy.waitVisible("table");
    cy.get("table").contains("th", "Name").should("be.visible");
  });

  it("test delete no role - see number", () => {
    // login
    cy.then(function () {
      if (this.userName) {
        cy.login(this.userName, this.userName + this.userName);
      } else {
        createUserNoRole();
      }
      changeRole(this.userId, this.superAdminRoleId)
    });

    cy.interceptToken();
    cy.intercept("GET", getList).as("getDepartement");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getDepartement", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("tbody th")
      .first()
      .invoke("text")
      .should("match", /^[0-9]*$/);
  });
});
