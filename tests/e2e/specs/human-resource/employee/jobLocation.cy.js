import {
  generateText,
  changeRole,
  createUserNoRole,
  createJobLocationApi,
} from "../functions";

const randomString = generateText(7);
const name = randomString;
const url = "/human-resource/job-location";
const apiUrl =
  Cypress.env("VUE_APP_API_ENDPOINT") +
  "/human-resource/employee/job-locations";
const getList = apiUrl + "**";
const getDetail = apiUrl + "/*";
const timeOut = { timeout: 300000 };

describe("HRIS - Job Location - Create", () => {
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
    cy.get('#main-container a[href*="/"]').contains("JOB LOCATION").click();

    cy.intercept("GET", getList).as("getJobLocation");
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // table list job location
    cy.waitVisible("table");
    cy.get("table").contains("th", "name").should("be.visible");
    cy.get("table").contains("th", "area value").should("be.visible");
    cy.get("table").contains("th", "kpi multiplier").should("be.visible");

    // button add and form input job location
    cy.waitVisible(".input-group-prepend");
    cy.get(".input-group-prepend").click();
    cy.get(".sweet-modal h2", timeOut).should("contain", "ADD JOB LOCATION");
    cy.get(".sweet-content-content input").eq(0).type(name);
    cy.get(".sweet-content-content input").eq(1).type("123");
    cy.get(".sweet-content-content input").eq(2).type("123");

    // input and save job location
    cy.get(".sweet-modal").contains("button", "SAVE").should("be.visible");
    cy.intercept("POST", getList).as("createJobLocation");
    cy.get('.sweet-modal input[id="name"]', timeOut).type(name);
    cy.get(".sweet-modal button").contains("SAVE").click();
    cy.wait("@createJobLocation", timeOut)
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
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // detail name
    cy.intercept("GET", getDetail).as("getDetailJobLocation");
    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a").contains(name).click();
    cy.wait("@getDetailJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);
  });

  it("create data if data table < 10", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.get('.pagination [class="page-item"]').then(($pagination) => {
      if ($pagination.length <= 3) {
        createJobLocationApi();
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
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation", timeOut)
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
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get('.pagination [class="page-item"]').last().click();
    cy.wait("@getJobLocation", timeOut)
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
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation", timeOut)
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
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get(".input-group-prepend").should("not.exist");
  });

  it("test user has role - empty input and save", () => {
    // login
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation", timeOut)
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
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation", timeOut)
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

describe("HRIS - Job Location - Read", () => {
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
    cy.get('#main-container a[href*="/"]').contains("JOB LOCATION").click();

    cy.intercept("GET", getList).as("getJobLocation");
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // table list job location
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
    cy.get('#main-container a[href*="/"]').contains("JOB LOCATION").click();

    cy.intercept("GET", getList).as("getJobLocation");
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // list pagination
    cy.waitVisible(".pagination");

    // find name
    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // see detail name
    cy.intercept("GET", getDetail).as("getDetailJobLocation");
    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a").contains(name).click();
    cy.wait("@getDetailJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.get('[type="button"]').should("contain", "CREATE");
    cy.get('[type="button"]').should("contain", "EDIT");
    cy.get('[type="button"]').should("contain", "DELETE");
  });

  it("test have access read - list 10 of data", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation", timeOut)
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
    cy.get('#main-container a[href*="/"]').contains("JOB LOCATION").click();

    cy.intercept("GET", getList).as("getJobLocation");
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // find name
    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // see detail name
    cy.intercept("GET", getDetail).as("getDetailJobLocation");
    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a").contains(name).click();
    cy.wait("@getDetailJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // name column
    cy.get('.block-content input[name="name"]').should("be.visible");
  });

  it("test have access read  - pagination", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get('.pagination [class="page-item"]').last().click();
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.waitVisible(".input-group-prepend"); // button create
    cy.waitVisible("#search-text"); // search
    cy.waitVisible(".pagination"); // pagination
  });
});

describe("HRIS - Job Location - Edit", () => {
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
    cy.get('#main-container a[href*="/"]').contains("JOB LOCATION").click();

    cy.intercept("GET", getList).as("getJobLocation");
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    // table list job location
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
    cy.get('#main-container a[href*="/"]').contains("JOB LOCATION").click();

    cy.intercept("GET", getList).as("getJobLocation");
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // find name
    cy.wait(3000);
    cy.waitVisible("#search-text");
    cy.get("#search-text").type(name);
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("table td").should("contain", name);

    // see detail name
    cy.intercept("GET", getDetail).as("getDetailJobLocation");
    cy.wait(2000);
    cy.waitVisible("table");
    cy.get("table a").contains(name).click();
    cy.wait("@getDetailJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.get("input#name", timeOut).should("have.value", randomString);
    cy.get('[type="button"]').contains("EDIT").click();

    cy.waitVisible(".sweet-title");
    cy.get(".sweet-title").should("contain", "EDIT JOB LOCATION");

    cy.wait("@getDetailJobLocation", timeOut)
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
    cy.intercept("PATCH", getDetail).as("updateJobLocation");
    cy.get(".sweet-content-content button").last().click();

    cy.wait("@updateJobLocation", timeOut)
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
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation", timeOut)
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
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation", timeOut)
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

describe("HRIS - Job Location - Delete", () => {
  beforeEach(() => {
    cy.hideXHR();
  });

  it("test have access delete", () => {
    cy.login("admin", "admin");

    cy.interceptToken();
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation").its("response.statusCode").should("equal", 200);

    // table list job location
    cy.waitVisible("table");
    cy.get("table").contains("th", "Name").should("be.visible");

    cy.waitVisible("#search-text");
    cy.get("#search-text").type(randomString);
    cy.wait("@getJobLocation").its("response.statusCode").should("equal", 200);

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
      .should("equal", 200);

    cy.wait(1500);
    cy.url().should("contain", url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation").its("response.statusCode").should("equal", 200);

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
      changeRole(this.userId, this.superAdminRoleId);
    });

    cy.interceptToken();
    cy.intercept("GET", getList).as("getJobLocation");

    cy.visit(url);

    cy.waitToken();
    cy.wait(2000);
    cy.wait("@getJobLocation", timeOut)
      .its("response.statusCode")
      .should("equal", 200);

    cy.waitVisible("table");
    cy.get("tbody th")
      .first()
      .invoke("text")
      .should("match", /^[0-9]*$/);
  });
});
