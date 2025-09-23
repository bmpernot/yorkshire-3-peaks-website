export default class resultsPage {
  open() {
    cy.visit(`${Cypress.env("ui_base_url")}/event/results`);
    return this;
  }
  verifyEvents() {
    return this;
  }
  verifyEntries() {
    return this;
  }
  refreshEvents() {
    cy.get("[data-cy=refresh-events]").click();
    return this;
  }
  refreshEntries() {
    cy.get("[data-cy=refresh-entries]").click();
    return this;
  }
  verifyEventsError() {
    cy.get("[data-cy=events-error-message]").should("contain", "Failed to get events");
    return this;
  }
  verifyEntriesError() {
    cy.get("[data-cy=entries-error-message]").should("contain", "Failed to get events");
    return this;
  }
  sortEntries() {
    return this;
  }
}
