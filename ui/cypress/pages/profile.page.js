export default class resultsPage {
  open() {
    cy.visit(`${Cypress.env("ui_base_url")}/user/profile`);
    return this;
  }
  waitFor(alias) {
    cy.wait(alias);
    return this;
  }
  waitForThen(alias, functionDef = () => {}) {
    cy.wait(alias).then(functionDef);
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
      cy.get(`#entry-card-${team.teamId} #card-members`).should("contain.text", `${team.members.length} members`);
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
  deleteTeam() {
    cy.get(`#delete-team`).click();
    return this;
  }
  verifyConfirmDeleteTeam() {
    cy.get(`#delete-team-title`).should("contain", "Delete Team");
    cy.get(`#delete-team-warning`).should(
      "contain",
      "You are about to delete the team, please consider the following:",
    );
    cy.get(`#delete-team-warnings`).should("contain", "- This action is permanent and cannot be undone.");
    cy.get(`#delete-team-warnings`).should("contain", "- This action is performed for everyone in the team.");
    cy.get(`#delete-team-warnings`).should(
      "contain",
      "- If anyone from the team would like a refund for any donations made as part of this team please do so before deleting the team.",
    );

    return this;
  }
  confirmDeleteTeam() {
    cy.get(`#confirm-delete-team`).click();
    return this;
  }
  verifyToast(text) {
    cy.get('[class^="Toastify__toast"]').should("contain", text);
    return this;
  }
  modifyTeamName(teamName) {
    cy.get("#teamName").clear();
    cy.get("#teamName").type(teamName);
    return this;
  }
  modifyMember({ teamMemberIndex, additionalRequirementsText, willingToVolunteer }) {
    if (willingToVolunteer) {
      this.happyToVolunteer({ teamMemberIndex });
    }
    if (additionalRequirementsText) {
      this.additionalRequirements({ teamMemberIndex, additionalRequirementsText });
    }
    return this;
  }
  searchForUser({ teamMemberIndex, searchValue }) {
    cy.get(`[id=team-member-${teamMemberIndex}]`).type(searchValue);
    return this;
  }
  selectUser({ teamMemberIndex, option }) {
    cy.get(`[id=team-member-${teamMemberIndex}-option-${option}]`).click();
    return this;
  }
  happyToVolunteer({ teamMemberIndex }) {
    cy.get(`[id=team-member-happy-to-volunteer-${teamMemberIndex}]`).click();
    return this;
  }
  additionalRequirements({ teamMemberIndex, additionalRequirementsText }) {
    cy.get(`[id=requirements-${teamMemberIndex}]`).clear();
    cy.get(`[id=requirements-${teamMemberIndex}]`).type(additionalRequirementsText);
    return this;
  }
  removeMember({ teamMemberIndex }) {
    cy.get(`[id=team-member-${teamMemberIndex}]`).click();
    cy.get(`[id=team-member-${teamMemberIndex}]`).siblings().eq(0).click();
    return this;
  }
  saveTeamChanges() {
    cy.get("#save-team-changes").click();
    return this;
  }
  verifyTeamInformationIsDisabled() {
    cy.get(`#delete-team`).should("not.exist");
    cy.get(`#save-team-changes`).should("not.exist");
    cy.get("#teamName").should("be.disabled");
    for (let index = 0; index < 3; index++) {
      cy.get(`[id=team-member-${index}]`).should("be.disabled");
      cy.get(`[id=requirements-${index}]`).should("be.disabled");
      cy.get(`[id=team-member-happy-to-volunteer-${index}]`).should("be.disabled");
    }

    return this;
  }
  pay(amount) {
    this.payAmount(amount);
    cy.get("#pay").click();
    return this;
  }
  urlShouldBe(page) {
    cy.url().should("equal", `${Cypress.env("ui_base_url")}/${page}`);
    return this;
  }
  payAmount(amount) {
    cy.get("#payment-amount").type(amount);
    return this;
  }
  verifyPayIsDisabled() {
    cy.get("#pay").should("be.disabled");
    return this;
  }
}
