export default class resultsPage {
  open() {
    cy.visit(`${Cypress.env("ui_base_url")}/event/current`);
    return this;
  }
  waitFor(alias) {
    cy.wait(alias);
    return this;
  }
  verifyEventSummary(eventInformation = {}) {
    console.log(eventInformation);
    cy.get("[id=walkers-needed-info]").should(
      "contain",
      `${eventInformation.currentWalkers}/${eventInformation.requiredWalkers}`,
    );
    cy.get("[id=volunteers-needed-info]").should(
      "contain",
      `${eventInformation.currentVolunteers}/${eventInformation.requiredVolunteers}`,
    );
    cy.get("[id=money-raised-info]").should("contain", `£${eventInformation.moneyRaised}`);
    cy.get("[id=event-date-info]").should(
      "contain",
      `${new Date(eventInformation.startDate).getDate()} - ${new Date(eventInformation.endDate).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      )}`,
    );
    return this;
  }
  verifyEventTeamRegistration() {
    cy.get("[id=team-registration-information]")
      .should("contain.text", "• Teams must have 3 - 5 members.")
      .and(
        "contain.text",
        "• Payment is managed on your profile page. Each member can contribute, but your team must meet or exceed the full amount.",
      )
      .and("contain.text", "• You can edit your team details anytime from your profile.")
      .and("contain.text", "• All team members will have access to update the entry.");
    return this;
  }
  verifyEventVolunteerRegistration() {
    cy.get("[id=volunteer-registration-information]")
      .should(
        "contain.text",
        "Volunteering involves supporting walkers along the route, helping with checkpoints, providing refreshments, assisting with logistics, and ensuring everyone stays safe.",
      )
      .and("contain.text", "No prior experience is necessary - just enthusiasm and a willingness to help!");
    return this;
  }
  searchForUser({ teamMemberNumber, searchValue }) {
    cy.get(`[id=team-members-${teamMemberNumber}]`).type(searchValue);
    return this;
  }
  verifyUserSearch({ teamMemberNumber, option, value }) {
    cy.get(`[id=team-members-${teamMemberNumber}-option-${option}]`).should("contain.text", value);
  }
  registerTeam() {
    return this;
  }
  registerAsVolunteerForEvent({ additionalRequirement = "" }) {
    if (additionalRequirement.length > 0) {
      cy.get("[id=additional-requirements-volunteer]").type(additionalRequirement);
    }
    cy.get("[id=volunteer-registration-button]").click();
    return this;
  }
  verifyNoEventsAvailable() {
    cy.get("[id=no-events]")
      .should("be.visible")
      .and(
        "contain.text",
        "There are no current events planned - if you would like to help set one up please contact us at yorkshirepeaks@gmail.com",
      );
    return this;
  }
  verifyEventTeamRegistrationSignInButton() {
    cy.get("[id=event-team-registration-sign-in-button]")
      .should("be.visible")
      .and("contain.text", "Sign in to register a team");
    return this;
  }
  verifyEventVolunteerRegistrationSignInButton() {
    cy.get("[id=event-volunteer-registration-sign-in-button]")
      .should("be.visible")
      .and("contain.text", "Sign in to volunteer");
    return this;
  }
}
