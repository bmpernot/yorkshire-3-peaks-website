const settings = ["profile", "account", "signOut"];

const pages = [
  "home",
  "route",
  "rules",
  {
    label: "events",
    links: ["event", "promotion"],
  },
  "results",
  "organisers",
  "admin",
];

const navMenu = ["home", "route", "rules", "current event", "promotion", "results", "organisers", "admin"];

export default class authPage {
  open(page) {
    cy.visit(`${Cypress.env("ui_base_url")}/${page}`);
    return this;
  }

  urlShouldBe(page) {
    cy.url().should("equal", `${Cypress.env("ui_base_url")}/${page}`);
    return this;
  }

  verifyFooter() {
    cy.get("[data-cy=footer]").should("be.visible");
    cy.get("[data-cy=footer] [data-cy=title]").should("contain", "Yorkshire 3 Peaks");
    cy.get("[data-cy=footer] [data-cy=description]")
      .should(
        "contain",
        "Yorkshire 3 Peaks is a charity event run by volunteers and is always welcoming of new helpers.",
      )
      .and("contain", "If you are interested in helping out contact us using the email below.")
      .and(
        "contain",
        "Feel free to pass this website on to anyone you think would be interested. The more the merrier.",
      );
    cy.get("[data-cy=footer] [data-cy=copyright]").should(
      "contain",
      `Copyright © ${new Date().getFullYear()} Ben Pernot`,
    );
    cy.get("[data-cy=footer] [data-cy=contact-info]").should("contain", "yorkshirepeaks@gmail.com");
    return this;
  }

  verifyNavBar() {
    cy.get("[data-cy=navbar]").should("be.visible");
    cy.get("[data-cy=title]").should("be.visible").and("contain", "Y3P");
    cy.get("[data-cy=logo]").should("be.visible");

    if (Cypress.config("viewportWidth") < 900) {
      cy.get("[data-cy=small-nav-menu]").should("be.visible");
      cy.get("[data-cy=small-nav-menu] [data-cy=button]").click();
      cy.get("[data-cy=small-nav-menu-dropdown]").as("nav-menu");
    } else {
      cy.get("[data-cy=large-nav-menu]").as("nav-menu").should("be.visible");
    }

    pages.forEach((page) => {
      if (typeof page === "object") {
        cy.get(`@nav-menu`).find(`[data-cy=${page.label}] [data-cy=button]`).should("be.visible").click();
        page.links.forEach((link) => {
          cy.get(`[data-cy=${page.label}-dropdown-${link}]`).should("be.visible");
        });

        // close the drop down
        if (Cypress.config("viewportWidth") < 900) {
          cy.get(`[data-cy=${page.label}-dropdown]`).click(200, 100);
          cy.get("[data-cy=small-nav-menu] [data-cy=button]").click();
        } else {
          cy.get(`[data-cy=${page.label}-dropdown]`).click();
        }
      } else {
        cy.get(`@nav-menu`).find(`[data-cy=${page}]`).should("be.visible");
      }
    });

    // close the drop down
    if (Cypress.config("viewportWidth") < 900) {
      cy.get(`[data-cy=small-nav-menu-dropdown]`).click(0, 0);
    }

    cy.get("[data-cy=user-settings]").should("be.visible");
    cy.get("[data-cy=user-settings] [data-cy=button]").click();
    settings.forEach((setting) => {
      cy.get(`[data-cy=user-settings-dropdown-${setting}]`).should("be.visible");
    });

    return this;
  }

  goToPage(page) {
    const navigateTo = {
      Home: () => {
        cy.get("[data-cy=home]").click();
      },
      Route: () => {
        cy.get("[data-cy=route]").click();
      },
      Rules: () => {
        cy.get("[data-cy=rules]").click();
      },
      Results: () => {
        cy.get("[data-cy=results]").click();
      },
      Organisers: () => {
        cy.get("[data-cy=organisers]").click();
      },
      Admin: () => {
        cy.get("[data-cy=admin]").click();
      },
      SignOut: () => {
        cy.get("[data-cy=user-settings-dropdown-signOut]").click();
      },
      Profile: () => {
        cy.get("[data-cy=user-settings-dropdown-profile]").click();
      },
      Account: () => {
        cy.get("[data-cy=user-settings-dropdown-account]").click();
      },
      "Current Event": () => {
        cy.get("[data-cy=events]").click();
        cy.get('[data-cy="events-dropdown-event"]').click();
      },
      Promotion: () => {
        cy.get("[data-cy=events]").click();
        cy.get('[data-cy="events-dropdown-promotion"]').click();
      },
    };

    if (Cypress.config("viewportWidth") < 900) {
      cy.get("[data-cy=small-nav-menu]").as("nav-menu");
      if (navMenu.includes(page.toLowerCase())) {
        cy.get("[data-cy=small-nav-menu] [data-cy=button]").click();
      }
    } else {
      cy.get("[data-cy=large-nav-menu]").as("nav-menu");
    }

    if (settings.includes(page.toLowerCase())) {
      cy.get("[data-cy=user-settings] [data-cy=button]").click();
    }

    navigateTo[page]();

    return this;
  }

  verifyPage(page) {
    cy.get("[data-cy=body]").should("contain", page);
    return this;
  }
}
