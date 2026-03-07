export default class authPage {
  open() {
    cy.visit(`${Cypress.env("ui_base_url")}/organiser`);
    return this;
  }

  fillInRegisterEventForm({
    startDate,
    endDate,
    requiredWalkers,
    requiredVolunteers,
    earlyBirdPrice,
    earlyBirdCutoff,
    price,
  }) {
    if (startDate) {
      cy.get("#startDate").type(startDate);
    }
    if (endDate) {
      cy.get("#endDate").type(endDate);
    }
    if (requiredWalkers) {
      cy.get("#requiredWalkers").type(requiredWalkers);
    }
    if (requiredVolunteers) {
      cy.get("#requiredVolunteers").type(requiredVolunteers);
    }
    if (earlyBirdPrice) {
      cy.get("#earlyBirdPrice").type(earlyBirdPrice);
    }
    if (earlyBirdCutoff) {
      cy.get("#earlyBirdCutoff").type(earlyBirdCutoff);
    }
    if (price) {
      cy.get("#price").type(price);
    }
    return this;
  }

  submitRegisterEventForm() {
    cy.get("[id=register-event-container] button[type='submit']").click();
    return this;
  }

  waitForThen(item, functionCall = () => {}) {
    cy.wait(item).then(functionCall);
    return this;
  }

  verifyToast(message) {
    cy.get(".Toastify__toast").should("contain", message);
    return this;
  }

  verifyFormError(message, key = "0") {
    cy.get(`[id=error-card-${key}]`).should("contain", message);
    return this;
  }
}
