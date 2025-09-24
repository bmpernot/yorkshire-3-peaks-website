export default class resultsPage {
  open() {
    cy.visit(`${Cypress.env("ui_base_url")}/event/results`);
    return this;
  }
  verifyEvents(events) {
    events.forEach((event) => {
      const date = new Date(event.startDate);
      const formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
      cy.get("[data-cy=events-list]").children().should("have.value", event.eventId).and("have.text", formattedDate);
    });
    return this;
  }
  verifyEntries(entries) {
    entries.forEach((entry) => {
      cy.get("[data-cy=entries-table]").should("contain", entry);
    });
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
  sortEntries(field) {
    cy.get(`[data-cy=entries-table] [data-cy=sort-${field}]`).click();
    return this;
  }
}
