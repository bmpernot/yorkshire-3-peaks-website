const settings = ["profile", "account", "sign out"];

const pages = [
  "home",
  {
    label: "event",
    links: ["current event", "route", "rules", "results", "promotion"],
  },
  "organisers",
  "admin",
];

const navMenu = ["home", "route", "rules", "current event", "promotion", "results", "organisers", "admin"];

export default class homePage {
  open() {
    cy.visit(`${Cypress.env("ui_base_url")}/`);
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
        cy.get(`@nav-menu`).find(`[data-cy="${page.label}"] [data-cy=button]`).should("be.visible").click();
        page.links.forEach((link) => {
          cy.get(`[data-cy="${page.label}-dropdown-${link}"]`).should("be.visible");
        });

        // close the drop down
        if (Cypress.config("viewportWidth") < 900) {
          cy.get(`[data-cy="${page.label}-dropdown"]`).click(200, 100);
          cy.get("[data-cy=small-nav-menu] [data-cy=button]").click();
        } else {
          cy.get(`[data-cy="${page.label}-dropdown"]`).click();
        }
      } else {
        cy.get(`@nav-menu`).find(`[data-cy="${page}"]`).should("be.visible");
      }
    });

    // close the drop down
    if (Cypress.config("viewportWidth") < 900) {
      cy.get(`[data-cy=small-nav-menu-dropdown]`).click(0, 0);
    }

    cy.get("[data-cy=user-settings]").should("be.visible");
    cy.get("[data-cy=user-settings] [data-cy=button]").click();
    settings.forEach((setting) => {
      cy.get(`[data-cy="user-settings-dropdown-${setting}"]`).should("be.visible");
    });

    return this;
  }

  goToPage(page) {
    const navigateTo = {
      Home: () => {
        cy.get("[data-cy=home]").click();
      },
      Route: () => {
        cy.get("[data-cy=event] [data-cy=button]").click();
        cy.get("[data-cy=event-dropdown-route]").click();
      },
      Rules: () => {
        cy.get("[data-cy=event] [data-cy=button]").click();
        cy.get("[data-cy=event-dropdown-rules]").click();
      },
      Results: () => {
        cy.get("[data-cy=event] [data-cy=button]").click();
        cy.get("[data-cy=event-dropdown-results]").click();
      },
      Organisers: () => {
        cy.get("[data-cy=organisers]").click();
      },
      Admin: () => {
        cy.get("[data-cy=admin]").click();
      },
      SignOut: () => {
        cy.get('[data-cy="user-settings-dropdown-sign out"]').click();
      },
      Profile: () => {
        cy.get("[data-cy=user-settings-dropdown-profile]").click();
      },
      Account: () => {
        cy.get("[data-cy=user-settings-dropdown-account]").click();
      },
      "Current Event": () => {
        cy.get("[data-cy=event] [data-cy=button]").click();
        cy.get('[data-cy="event-dropdown-current event"]').click();
      },
      Promotion: () => {
        cy.get("[data-cy=event] [data-cy=button]").click();
        cy.get('[data-cy="event-dropdown-promotion"]').click();
      },
      "Sign In": () => {
        cy.get('[data-cy="signIn-button"]').click();
      },
    };

    if (Cypress.config("viewportWidth") < 900 && navMenu.includes(page.toLowerCase())) {
      cy.get("[data-cy=small-nav-menu] [data-cy=button]").click();
    }

    if (settings.includes(page.toLowerCase())) {
      cy.get("[data-cy=user-settings] [data-cy=button]").click();
    }

    navigateTo[page]();

    return this;
  }

  urlShouldBe(page) {
    cy.url().should("equal", `${Cypress.env("ui_base_url")}/${page}`);
    return this;
  }

  verifyRestrictedLinksVisibility({ userProfile, organiser, admin }) {
    if (userProfile) {
      cy.get('[data-cy="user-settings"]').should("be.visible");
    } else {
      cy.get('[data-cy="signIn-button"]').should("be.visible");
    }
    if (Cypress.config("viewportWidth") < 900) {
      cy.get("[data-cy=small-nav-menu] [data-cy=button]").click();
    }
    cy.get('[data-cy="organisers"]').should(organiser ? "be.visible" : "not.exist");
    cy.get('[data-cy="admin"]').should(admin ? "be.visible" : "not.exist");
    return this;
  }

  signOut() {
    return this;
  }
}
