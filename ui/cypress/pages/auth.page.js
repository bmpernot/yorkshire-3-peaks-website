export default class authPage {
  open(page) {
    cy.visit(`${Cypress.env("ui_base_url")}/${page}`);
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

  submitResetPasswordForm() {
    cy.get("#resetPassword").click();
    return this;
  }

  submitUpdateDetailsForm() {
    cy.get("#updateDetails").click();
    return this;
  }

  submitUpdatePasswordForm() {
    cy.get("#updatePassword").click();
    return this;
  }

  submitDeleteAccountForm() {
    cy.get("#deleteAccount").click();
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

  verifyToast(message) {
    cy.get(".Toastify__toast").should("contain", message);
    return this;
  }

  verifyNoToast() {
    cy.get(".Toastify__toast").should("not.exist");
    return this;
  }

  verifyFormError(message) {
    cy.get("#error-card").should("contain", message);
    return this;
  }

  fillConfirmSignupForm(code) {
    cy.get("#code").clear();
    cy.get("#code").type(code);
    return this;
  }

  fillSigninForm({ email, password }) {
    cy.get("#email").clear();
    cy.get("#email").type(email);

    cy.get("#password").clear();
    cy.get("#password").type(password);
    return this;
  }

  fillForgotPasswordForm(open, email) {
    if (open) {
      cy.get("#forgotPassword").click();
    }
    if (email) {
      cy.get("#reset-password-for-email").clear();
      cy.get("#reset-password-for-email").type(email);
    }
    return this;
  }

  resendCode() {
    cy.get("#resendCode").click();
    return this;
  }

  fillConfirmResetPasswordForm({ code, password }) {
    cy.get("#code").clear();
    cy.get("#code").type(code);

    cy.get("#password").clear();
    cy.get("#password").type(password);

    cy.get("#confirmPassword").clear();
    cy.get("#confirmPassword").type(password);
    return this;
  }

  fillUpdateDetailsForm({ fname, lname, number, iceNumber, notify }) {
    if (fname?.length >= 0) {
      cy.get("#fname").clear();
      if (fname.length) {
        cy.get("#fname").type(fname);
      }
    }
    if (lname?.length >= 0) {
      cy.get("#lname").clear();
      if (lname) {
        cy.get("#lname").type(lname);
      }
    }
    if (number) {
      cy.get("#number").clear();
      cy.get("#number").type(number);
    }
    if (iceNumber) {
      cy.get("#iceNumber").clear();
      cy.get("#iceNumber").type(iceNumber);
    }
    if (notify) {
      cy.get("#notify").click();
    }
    return this;
  }

  fillUpdatePasswordForm({ oldPassword, newPassword, confirmNewPassword }) {
    cy.get("#oldPassword").type(oldPassword);
    cy.get("#newPassword").type(newPassword);
    cy.get("#confirmNewPassword").type(confirmNewPassword ?? newPassword);
    return this;
  }

  fillDeleteAccountForm({ email }) {
    cy.get("#confirmDeletion").type(email);
    return this;
  }
}
