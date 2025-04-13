import userObjects from "../fixtures/userObjects.js";

export default class authPage {
  open(page, user) {
    cy.visit(`${Cypress.env("ui_base_url")}/${page}`, {
      onBeforeLoad(win) {
        const userObject = userObjects[user];
        if (userObject) {
          win.__CYPRESS_TEST_USER__ = userObject;
        }
      },
    });
    return this;
  }

  urlShouldBe(page) {
    cy.url().should("equal", `${Cypress.env("ui_base_url")}/${page}`);
    return this;
  }

  fillSignupForm({ firstName, lastName, number, iceNumber, email, password, confirmPassword, notify }) {
    if (firstName) {
      cy.get("#fname").type(firstName);
    }
    if (lastName) {
      cy.get("#lname").type(lastName);
    }
    if (number) {
      cy.get("#number").type(number);
    }
    if (iceNumber) {
      cy.get("#iceNumber").type(iceNumber);
    }
    if (email) {
      cy.get("#email").type(email);
    }
    if (password) {
      cy.get("#password").type(password);
    }
    if (confirmPassword) {
      cy.get("#confirmPassword").type(confirmPassword);
    }
    if (notify) {
      cy.get("#notify").check();
    }
    return this;
  }

  submitForm() {
    cy.get("button[type='submit']").click();
    return this;
  }

  waitForThen(item, functionCall = () => {}) {
    cy.wait(item).then(functionCall);
    return this;
  }

  checkValidationMessages(fieldErrors) {
    fieldErrors.forEach(({ field, errors }) => {
      errors.forEach((errorMessage) => {
        cy.get(`#${field}-helper-text`).should("contain", errorMessage);
      });
    });
    return this;
  }

  checkNoValidationMessages(fieldErrors) {
    fieldErrors.forEach((input) => {
      cy.get(`#${input}-helper-text`).should("not.exist");
    });
    return this;
  }

  clearInputs(inputs) {
    inputs.forEach((input) => {
      cy.get(`#${input}`).clear();
    });
    return this;
  }

  verifyIfApiHasBeenCalled(apiCall, boolean) {
    if (boolean) {
      // TODO - doesn't work yet
      cy.get(apiCall).should(`have.been.called`);
    } else {
      cy.get(apiCall).should("equal", null);
    }
    return this;
  }

  verifyToast(message) {
    cy.get(".Toastify__toast-body > :nth-child(2)").should("contain", message);
    return this;
  }

  verifyFormError(message) {
    cy.get("#error-card").should("contain", message);
    return this;
  }

  fillConfirmSignupForm(code){
    cy.get('#code').clear()
    cy.get('#code').type(code)
    return this
  }
}
