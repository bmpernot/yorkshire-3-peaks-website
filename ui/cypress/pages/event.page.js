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
      `${eventInformation.currentWalkers} / ${eventInformation.requiredWalkers}`,
    );
    cy.get("[id=volunteers-needed-info]").should(
      "contain",
      `${eventInformation.currentVolunteers} / ${eventInformation.requiredVolunteers}`,
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
      .should("contain.text", "• Teams must have 3 - 5 members and must include yourself.")
      .and(
        "contain.text",
        "• Payment is managed on your profile page. Each member can contribute, but your team must meet or exceed the full amount.",
      )
      .and("contain.text", "• You can edit your team details anytime from your profile.")
      .and("contain.text", "• All team members will have access to update the entry.")
      .and("contain.text", "• Disabled users in the user search are ones that have already signed up to a team.");
    return this;
  }
  verifyEventVolunteerRegistration() {
    cy.get("[id=volunteer-registration-information]")
      .should("contain.text", "What volunteers do:")
      .and(
        "contain.text",
        "Support walkers along the route, help with checkpoints, provide refreshments, assist with logistics, and ensure everyone stays safe. No prior experience necessary - just enthusiasm and willingness to help!",
      );
    return this;
  }
  typeTeamName(teamName) {
    cy.get("[id=teamName]").type(teamName);
    return this;
  }
  searchForUser({ teamMemberNumber, searchValue }) {
    cy.get(`[id=team-member-${teamMemberNumber}]`).type(searchValue);
    return this;
  }
  verifyUserSearchDisabled({ teamMemberNumber, option }) {
    cy.get(`[id=team-member-${teamMemberNumber}-option-${option}]`).should("have.attr", "aria-disabled", "true");
    return this;
  }
  selectUser({ teamMemberNumber, option }) {
    cy.get(`[id=team-member-${teamMemberNumber}-option-${option}]`).click();
    return this;
  }
  verifyUserSearch({ teamMemberNumber, option, value }) {
    cy.get(`[id=team-member-${teamMemberNumber}-option-${option}]`).should("contain.text", value);
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
    cy.get("[id=no-events-title]").should("be.visible").and("have.text", "No Current Events");
    cy.get("[id=no-events-body]")
      .should("be.visible")
      .and(
        "have.text",
        "There are no events currently planned. If you would like to help organize one, please contact us at yorkshirepeaks@gmail.com",
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
  happyToVolunteer({ teamMemberNumber }) {
    cy.get(`[id=team-member-happy-to-volunteer-${teamMemberNumber}]`).click();
    return this;
  }
  additionalRequirements({ teamMemberNumber, additionalRequirementsText }) {
    cy.get(`[id=requirements-${teamMemberNumber}]`).type(additionalRequirementsText);
    return this;
  }
  submitTeam() {
    cy.get("[id=submit-team-button]").click();
    return this;
  }
  verifyError({ errorIndex, value }) {
    cy.get(`[id=error-card-${errorIndex}]`).should("have.text", value);
    return this;
  }
}
