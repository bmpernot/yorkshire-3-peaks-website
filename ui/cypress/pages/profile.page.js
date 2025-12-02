export default class resultsPage {
  open() {
    cy.visit(`${Cypress.env("ui_base_url")}/user/profile`);
    return this;
  }
  waitFor(alias) {
    cy.wait(alias);
    return this;
  }
  then(functionDef = () => {}) {
    cy.then(functionDef);
    return this;
  }
  verifyError(index, text) {
    cy.get(`#error-card-${index}`).should("contain.text", text);
    return this;
  }
  verifyTitle() {
    cy.get("#title").should("contain.text", "Profile");
    return this;
  }
  verifyNoTeams() {
    cy.get("#no-teams").should("contain.text", "You are not currently part of any teams.");
    return this;
  }
  verifyTeamCards(teams) {
    teams.forEach((team) => {
      const paidAmount = team.cost - team.paid === 0 ? "Fully Paid" : `£${team.cost - team.paid} Left`;
      const eventData = `${new Date(team.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} → ${new Date(team.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;

      cy.get(`#entry-card-${team.teamId} #card-title`).should("contain.text", team.teamName);
      cy.get(`#entry-card-${team.teamId} #card-members`).should("contain.text", `${team.teamMembers.length} members`);
      cy.get(`#entry-card-${team.teamId} #card-paid`).should("contain.text", paidAmount);
      cy.get(`#entry-card-${team.teamId} #card-paid-amount`).should(
        "contain.text",
        `£${team.paid} / £${team.cost} paid`,
      );
      cy.get(`#entry-card-${team.teamId} #card-event-date`).should("contain.text", eventData);
    });
    return this;
  }
  openTeam(index) {
    cy.get(`#entry-card-${index}`).click();
    return this;
  }
}
