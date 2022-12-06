import { get } from "lodash";

const apiUrl = Cypress.env("VUE_APP_API_ENDPOINT");
const timeOut = { timeout: 500000 };

export function generateText(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function generateNumber(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return parseInt(result);
}

export function getCookieValue(name) {
  let document = cy.state("document");
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

export function apiRequest(
  method = "GET",
  path = "",
  params = {},
  alias = "request"
) {
  cy.request({
    method: method,
    url: apiUrl + "/" + path,
    body: params,
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + getCookieValue("TAT"),
      Tenant: "dev",
    },
  }).then((response) => {
    cy.wrap(response).as(alias);
  });
}

export function createUserNoRole() {
  let name = generateText(7);

  let params = {
    first_name: name,
    last_name: name,
    username: name,
    email: name + "@mail.com",
    password: name + name,
  };

  apiRequest("POST", "register", params, "createUser");
  cy.get("@createUser").then((req) => {
    expect(req.status).to.eq(201);
  });

  apiRequest("GET", "project/projects", {}, "get_code");
  cy.get("@get_code").then((req) => {
    expect(req.status).to.eq(200);
  });

  cy.login(params.username, params.password);

  cy.get("@get_code").then((getCode) => {
    let code = getCode.body.data[0].invitation_code;
    apiRequest(
      "POST",
      "project/request-join",
      { invitation_code: code },
      "requestJoin"
    );
  });

  cy.get("@requestJoin", timeOut).then((res) => {
    apiRequest(
      "PATCH",
      "project/request-join/" + res.body.data.id,
      {},
      "approveJoin"
    );
  });

  cy.get("@approveJoin", timeOut).then((res) => {
    cy.wrap(res.body.data.user_id).as("userId");
    cy.wrap(res.body.data.user_name).as("userName");

    apiRequest("GET", "master/roles/", {}, "getAllRoles");
  });

  cy.get("@getAllRoles", timeOut).then((res) => {
    res.body.data.forEach((roles) => {
      if (roles.name == "super admin") {
        cy.wrap(roles.id).as("superAdminRoleId");
      } else if (roles.name == "no role") {
        cy.wrap(roles.id).as("noRoleId");
      }
    });
  });

  cy.get("@noRoleId").then((id) => {
    if (!id) {
      apiRequest("POST", "master/roles", { name: "no role" }, "createNoRole");

      cy.get("@createNoRole", timeOut).then((res) => {
        cy.wrap(res.body.data.id).as("noRoleId");
      });
    }
  });

  cy.then(function () {
    changeRole(this.userId, this.noRoleId)
  });
}

export function changeRole(userId, roleId) {
  cy.then(function () {
    apiRequest(
      "PATCH",
      "master/user-roles/" + userId,
      { role_id: roleId },
      "setNoRole"
    );
  });
}

export function createDepartementApi(name = null, z = 10) {
  const apiDept = "human-resource/employee/groups";

  for (let i = 0; i < z; i++) {
    if (name == null) {
      name = generateText(4)
    }

    apiRequest("POST", apiDept, { name: name }, "createDepartemen");

    cy.get("@createDepartemen", timeOut).then((res) => {
      cy.wrap(res.body.data.id).as("departemen" + i);
    });
  }
}

export function createJobLocationApi(name = null, z = 10) {
  const apiDept = "human-resource/employee/statuses";

  for (let i = 0; i < z; i++) {
    if (name == null) {
      name = generateText(4)
    }

    let payload = {
      name: name,
      multiplier_kpi: 123,
      base_salary: 123
    }

    apiRequest("POST", apiDept, payload, "createEmploymentContract");

    cy.get("@createEmploymentContract", timeOut).then((res) => {
      cy.wrap(res.body.data.id).as("employee_contract_" + i);
    });
  }
}

export function createEmploymentContractApi(name = null, z = 10) {
  const apiDept = "human-resource/employee/groups";

  for (let i = 0; i < z; i++) {
    if (name == null) {
      name = generateText(4)
    }

    apiRequest("POST", apiDept, { name: name }, "createDepartemen");

    cy.get("@createDepartemen", timeOut).then((res) => {
      cy.wrap(res.body.data.id).as("departemen" + i);
    });
  }
}

export function createEmployee(data) {
  const apiEmployee = apiUrl + "/human-resource/employee/employees**";
  const urlEmployee = "/human-resource/employee";

  cy.interceptToken();
  cy.intercept("GET", apiEmployee).as("getEmployee");

  cy.visit(urlEmployee);

  cy.waitToken();
  cy.wait(2000);
  cy.wait("@getEmployee").its("response.statusCode").should("equal", 200);

  cy.waitVisible("#search-text");
  cy.get("#search-text").type(data.name);
  cy.wait("@getEmployee").its("response.statusCode").should("equal", 200);

  let exists = false;
  cy.waitVisible("table");
  cy.get("table tr")
    .each(($tr) => {
      if ($tr.find("td").length) {
        exists = true;
      }
    })
    .then(() => {
      if (!exists) {
        cy.get(".input-group-prepend").click();

        cy.get(".sweet-title", timeOut).should(
          "contain",
          "EMPLOYEE INFORMATION"
        );
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
      }
    });

  cy.waitVisible("table");
  cy.get("table td").should("contain", data.name);
}

export function createKpiTemplate(name, group = false, indicator = false) {
  const apiTemplate = apiUrl + "/human-resource/kpi/template**";
  const urlTemplate = "/human-resource/kpi-template";

  cy.interceptToken();
  cy.intercept("GET", apiTemplate).as("getTemplate");

  cy.visit(urlTemplate);

  cy.waitToken();
  cy.wait(2000);
  cy.wait("@getTemplate", timeOut)
    .its("response.statusCode")
    .should("equal", 200);

  cy.waitVisible("#search-text");
  cy.get("#search-text").type(name);
  cy.wait("@getTemplate", timeOut)
    .its("response.statusCode")
    .should("equal", 200);

  let exists = false;
  cy.waitVisible("table");
  cy.get("table tr")
    .each(($tr) => {
      if ($tr.find("td").length) {
        exists = true;
      }
    })
    .then(() => {
      if (!exists) {
        cy.get(".nav-item > a").should("contain", "ADD");
        cy.get(".nav-item > a").contains("ADD").click();

        cy.intercept("POST", apiTemplate).as("createKpiTemplate");

        cy.waitVisible("#create");
        cy.get("#create input#name").type(name);
        cy.get("#create [type=submit]").click();

        cy.wait("@createKpiTemplate", timeOut)
          .its("response.statusCode")
          .should("equal", 201);
        cy.get("div.vue-notification", timeOut)
          .should("have.class", "success")
          .and("contain", "Create success");
        cy.wait("@getTemplate", timeOut)
          .its("response.statusCode")
          .should("equal", 200);

        cy.waitVisible("table");
        cy.get("table td").should("contain", name);
        if (group && indicator) {
          editKpiTemplate(name, group, indicator);
        }
      } else {
        cy.waitVisible("table");
        cy.get("table td").should("contain", name);
      }
    });
}

export function editKpiTemplate(name, group, indicator) {
  const urlTemplate = "/human-resource/kpi-template";
  const apiTemplate = apiUrl + "/human-resource/kpi/template";
  const getList = apiTemplate + "s**";
  const getDetail = apiTemplate + "s/*";

  cy.interceptToken();
  cy.intercept("GET", getList).as("getKpiTemplate");

  cy.visit(urlTemplate);

  cy.waitToken();
  cy.wait(2000);
  cy.wait("@getKpiTemplate", timeOut)
    .its("response.statusCode")
    .should("equal", 200);

  cy.waitVisible("#search-text");
  cy.get("#search-text").clear().type(name);
  cy.wait("@getKpiTemplate", timeOut)
    .its("response.statusCode")
    .should("equal", 200);

  cy.intercept("GET", getDetail).as("getDetailKpiTemplate");

  cy.waitVisible("table");
  cy.get("table td").contains(name).click();

  cy.log("Create group");

  cy.wait("@getDetailKpiTemplate", timeOut)
    .its("response.statusCode")
    .should("equal", 200);
  cy.waitVisible("table");
  cy.get("table td").should("contain", "NO");
  cy.get("table td").should("contain", "KEY PERFORMANCE INDICATOR");
  cy.get("table td").should("contain", "WEIGHT");
  cy.get("table td button").should("contain", "GROUP");
  cy.wait(1500);
  cy.get("table td button").contains("GROUP").click();

  cy.intercept("POST", apiTemplate + "-groups").as("createKpiTemplateGroups");

  cy.waitVisible("#group");
  cy.get("#group .block-header").should("contain", "KPI TEMPLATE GROUP");
  cy.get("#group input").type(group);
  cy.wait(2000);
  cy.get("#group [type=submit]").click();

  cy.wait("@createKpiTemplateGroups", timeOut)
    .its("response.statusCode")
    .should("equal", 201);

  cy.get("#group .block-content tr td", timeOut).should("contain", group);
  cy.wait(2000);
  cy.get("#group .modal-footer [type=button]").click();

  cy.wait(2000);
  cy.log("create indicator");

  cy.wait(1500);
  cy.get("table td button").contains("INDICATOR").click();

  cy.intercept("POST", apiTemplate + "-indicators").as(
    "createKpiTemplateIndicators"
  );

  cy.waitVisible("#indicator");
  cy.get("#indicator .block-header").should(
    "contain",
    "KPI TEMPLATE INDICATOR"
  );
  cy.get("#indicator input#name").type(indicator);
  cy.wait(500);
  cy.get("#indicator input#weight").type(100);
  cy.wait(500);
  cy.get("#indicator input#target").type(80);
  cy.wait(500);
  cy.get("#indicator [type=submit]").click();

  cy.wait("@createKpiTemplateIndicators", timeOut)
    .its("response.statusCode")
    .should("equal", 201);

  cy.get("#indicator .block-content tr td", timeOut).should(
    "contain",
    indicator
  );
  cy.wait(2000);
  cy.get("#indicator .modal-footer [type=button]").click();
}
