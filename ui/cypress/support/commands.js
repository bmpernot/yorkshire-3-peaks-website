Cypress.Commands.add("interceptAmplifyAuth", (overrides = {}) => {
  console.log("Intercepting the amplify auth library");

  // Default mocked responses for each API call
  const defaultMocks = {
    signUp: {
      statusCode: 200,
      body: { user: { username: "testuser" } },
    },
    confirmSignUp: {
      statusCode: 200,
      body: "SUCCESS",
    },
    signIn: {
      statusCode: 200,
      body: { username: "testuser", attributes: {} },
    },
    signOut: {
      statusCode: 200,
      body: {},
    },
    resendSignUpCode: {
      statusCode: 200,
      body: {},
    },
    autoSignIn: {
      statusCode: 200,
      body: { username: "testuser" },
    },
    resetPassword: {
      statusCode: 200,
      body: {},
    },
    deleteUser: {
      statusCode: 200,
      body: {},
    },
    updateUserAttributes: {
      statusCode: 200,
      body: "SUCCESS",
    },
    updatePassword: {
      statusCode: 200,
      body: {},
    },
    confirmResetPassword: {
      statusCode: 200,
      body: "SUCCESS",
    },
    fetchAuthSession: {
      statusCode: 200,
      body: {},
    },
    fetchUserAttributes: {
      statusCode: 200,
      body: { username: "testuser", attributes: {} },
    },
  };

  // Merge overrides to allow custom behavior if needed
  const mocks = { ...defaultMocks, ...overrides };

  // Intercept requests to the Cognito URL and match based on the `x-amz-target` header
  cy.intercept("POST", "https://cognito-idp.eu-west-2.amazonaws.com", (req) => {
    const target = req.headers["x-amz-target"];

    // Mock responses based on the x-amz-target header value
    switch (target) {
      case "AWSCognitoIdentityProviderService.SignUp":
        req.reply(mocks.signUp);
        break;
      case "AWSCognitoIdentityProviderService.ConfirmSignUp":
        req.reply(mocks.confirmSignUp);
        break;
      case "AWSCognitoIdentityProviderService.SignIn":
        req.reply(mocks.signIn);
        break;
      case "AWSCognitoIdentityProviderService.SignOut":
        req.reply(mocks.signOut);
        break;
      case "AWSCognitoIdentityProviderService.ResendSignUpCode":
        req.reply(mocks.resendSignUpCode);
        break;
      case "AWSCognitoIdentityProviderService.AutoSignIn":
        req.reply(mocks.autoSignIn);
        break;
      case "AWSCognitoIdentityProviderService.ResetPassword":
        req.reply(mocks.resetPassword);
        break;
      case "AWSCognitoIdentityProviderService.DeleteUser":
        req.reply(mocks.deleteUser);
        break;
      case "AWSCognitoIdentityProviderService.UpdateUserAttributes":
        req.reply(mocks.updateUserAttributes);
        break;
      case "AWSCognitoIdentityProviderService.UpdatePassword":
        req.reply(mocks.updatePassword);
        break;
      case "AWSCognitoIdentityProviderService.ConfirmResetPassword":
        req.reply(mocks.confirmResetPassword);
        break;
      case "AWSCognitoIdentityProviderService.GetAuthSession":
        req.reply(mocks.fetchAuthSession);
        break;
      case "AWSCognitoIdentityProviderService.FetchUserAttributes":
        req.reply(mocks.fetchUserAttributes);
        break;
      default:
        req.reply({ statusCode: 400, body: "Unknown x-amz-target" });
    }
  }).as("amplifyAuthRequest");
});
