export default class resultsPage {
  open() {
    cy.visit(`${Cypress.env("ui_base_url")}/event/results`);
    return this;
  }
  waitFor(alias) {
    cy.wait(alias);
    return this;
  }
  verifyEvents(events) {
    cy.get("[id=events-list]").click();
    events.forEach((event) => {
      const date = new Date(event.startDate);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      cy.get(`[id=${event.eventId}]`).and("have.text", formattedDate);
    });
    cy.press(Cypress.Keyboard.Keys.TAB);
    return this;
  }
  verifySelectedEvent(event) {
    const date = new Date(event.startDate);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    cy.get("[id=events-list]").should("contain", formattedDate);
    return this;
  }
  verifyEntries(entries = []) {
    if (entries.length === 0) {
      cy.get("[id=entries-table]").should("not.exist");
    } else {
      entries.forEach((entry) => {
        cy.get(`[data-id=team-id-${entry.teamId}]`)
          .children()
          .then(($children) => {
            const numberOfChildren = $children.length;

            for (let index = 1; index < numberOfChildren - 1; index++) {
              if (index === 1) {
                cy.get(`[data-id=team-id-${entry.teamId}]`).children().eq(index).should("contain", entry.teamName);
              } else {
                cy.get(`[data-id=team-id-${entry.teamId}]`)
                  .children()
                  .eq(index)
                  .contains(/^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/);
              }
            }
          });
      });
    }
    return this;
  }
  verifyRowsExist(entries = []) {
    if (entries.length === 0) {
      cy.get("[id=entries-table]").should("not.exist");
    } else {
      entries.forEach((entry) => {
        cy.get(`[data-id=team-id-${entry.teamId}]`).should("be.visible");
      });
    }
    return this;
  }
  refreshEvents() {
    cy.get("[id=refresh-events]").click();
    return this;
  }
  refreshEntries() {
    cy.get("[id=refresh-entries]").click();
    return this;
  }
  then(functionDef = () => {}) {
    cy.then(functionDef);
    return this;
  }
  selectEvent(eventId) {
    cy.get("[id=events-list]").click();
    cy.get(`[id=${eventId}]`).click();
    return this;
  }
}
