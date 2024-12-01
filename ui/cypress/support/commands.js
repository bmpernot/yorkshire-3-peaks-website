import * as Auth from "aws-amplify/auth";

Cypress.Commands.add("stubAmplifyAuth", (overrides = {}) => {
  // Default stubs
  const defaultStubs = {
    signUp: cy.stub().resolves({ user: { username: "testuser" } }),
    confirmSignUp: cy.stub().resolves("SUCCESS"),
    signIn: cy.stub().resolves({ username: "testuser", attributes: {} }),
    signOut: cy.stub().resolves(),
    resendSignUpCode: cy.stub().resolves(),
    autoSignIn: cy.stub().resolves({ username: "testuser" }),
    resetPassword: cy.stub().resolves(),
    deleteUser: cy.stub().resolves(),
    updateUserAttributes: cy.stub().resolves("SUCCESS"),
    updatePassword: cy.stub().resolves(),
    confirmResetPassword: cy.stub().resolves("SUCCESS"),
    fetchAuthSession: cy.stub().resolves(),
    fetchUserAttributes: cy.stub().resolves("SUCCESS"),
  };

  // Merge overrides
  const stubs = { ...defaultStubs, ...overrides };

  // Replace Auth methods with stubs
  cy.stub(Auth, "signUp").callsFake(stubs.signUp);
  cy.stub(Auth, "confirmSignUp").callsFake(stubs.confirmSignUp);
  cy.stub(Auth, "signIn").callsFake(stubs.signIn);
  cy.stub(Auth, "signOut").callsFake(stubs.signOut);
  cy.stub(Auth, "resendSignUpCode").callsFake(stubs.resendSignUpCode);
  cy.stub(Auth, "autoSignIn").callsFake(stubs.autoSignIn);
  cy.stub(Auth, "resetPassword").callsFake(stubs.resetPassword);
  cy.stub(Auth, "deleteUser").callsFake(stubs.deleteUser);
  cy.stub(Auth, "updateUserAttributes").callsFake(stubs.updateUserAttributes);
  cy.stub(Auth, "updatePassword").callsFake(stubs.updatePassword);
  cy.stub(Auth, "confirmResetPassword").callsFake(stubs.confirmResetPassword);
  cy.stub(Auth, "fetchAuthSession").callsFake(stubs.fetchAuthSession);
  cy.stub(Auth, "fetchUserAttributes").callsFake(stubs.fetchUserAttributes);

  return stubs; // Return stubs for further assertions in tests
});
