import { USER_ROLES } from "../../src/lib/constants.mjs";

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
      body: {},
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
      body: {},
    },
    updatePassword: {
      statusCode: 200,
      body: {},
    },
    confirmResetPassword: {
      statusCode: 200,
      body: {},
    },
    fetchAuthSession: {
      statusCode: 200,
      body: {
        tokens: {
          accessToken: {
            payload: {
              sub: "76420294-00e1-700b-74d6-a22a780eeaed",
              "cognito:groups": ["Admin"],
              iss: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_U7iPe6Omz",
              client_id: "7g2g2m778tcjm5gcootc2jm0je",
              origin_jti: "d27c1ac1-e195-4e63-a81f-b4207cf4b0da",
              event_id: "40688a9c-bedb-459e-abd6-060ff1a4841a",
              token_use: "access",
              scope: "aws.cognito.signin.user.admin",
              auth_time: 1744454653,
              exp: 1744458253,
              iat: 1744454653,
              jti: "69d6b00e-d171-44a2-95ad-1ee2364f6be9",
              username: "76420294-00e1-700b-74d6-a22a780eeaed",
            },
          },
          idToken: {
            payload: {
              sub: "76420294-00e1-700b-74d6-a22a780eeaed",
              "custom:ice_number": "+441449736210",
              "cognito:groups": ["Admin"],
              email_verified: true,
              iss: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_U7iPe6Omz",
              phone_number_verified: false,
              "cognito:username": "76420294-00e1-700b-74d6-a22a780eeaed",
              given_name: "Benjamin",
              "custom:notify": "true",
              origin_jti: "d27c1ac1-e195-4e63-a81f-b4207cf4b0da",
              aud: "7g2g2m778tcjm5gcootc2jm0je",
              event_id: "40688a9c-bedb-459e-abd6-060ff1a4841a",
              token_use: "id",
              auth_time: 1744454653,
              phone_number: "+447425101817",
              exp: 1744458253,
              iat: 1744454653,
              family_name: "Pernot",
              jti: "92c497aa-e172-41ce-9def-fd8cebc5dd2d",
              email: "benjamin.pernot195@gmail.com",
            },
          },
          signInDetails: {
            loginId: "benjamin.pernot195@gmail.com",
            authFlowType: "USER_SRP_AUTH",
          },
        },
        userSub: "76420294-00e1-700b-74d6-a22a780eeaed",
      },
    },
    fetchUserAttributes: {
      statusCode: 200,
      body: { username: "76420294-00e1-700b-74d6-a22a780eeaed", attributes: {} },
    },
    getUser: {
      statusCode: 200,
      body: {},
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
      case "AWSCognitoIdentityProviderService.GetUser":
        req.reply(mocks.getUser);
        break;
      default:
        req.reply({ statusCode: 400, body: "Unknown x-amz-target in commands.js" });
    }
  }).as("amplifyAuthRequest");
});

Cypress.Commands.add("stubUser", (role) => {
  const user = {
    [USER_ROLES.USER]: {
      username: "76420294-00e1-700b-74d6-a22a780eeaef",
      accessToken:
        "eyJraWQiOiJNanpzNndcL2tzWWdNWEs0bmExRWI3M0xWN0tpWVV2QVJuT2pPSFBneVNnYz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl9VN2lQZTZPbXoiLCJjbGllbnRfaWQiOiI3ZzJnMm03Nzh0Y2ptNWdjb290YzJqbTBqZSIsIm9yaWdpbl9qdGkiOiJkMWI3ZTllMC01YzYxLTRmMTgtYTQxZi1hZTE4Mjc1NjUzNzMiLCJldmVudF9pZCI6IjU1Yjk3Mzc0LTBmMTctNGE5Ny05MDhlLTRlZjMwNzNlZDVlZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NDQ0NDQ2ODcsImV4cCI6MTc0NDQ0ODI4NywiaWF0IjoxNzQ0NDQ0Njg3LCJqdGkiOiJkNDRjNzFlZS0wMWNlLTQxZGQtYmVkMi1jYjJiZGU2YTg1NTkiLCJ1c2VybmFtZSI6Ijc2NDIwMjk0LTAwZTEtNzAwYi03NGQ2LWEyMmE3ODBlZWFlZCJ9.aj0gdnCakrN8QdEn4h0yaLFOzhfXELFYmYaPl1mdVtFwnqfU3A6DW4U9wlg9qmEbKXf2hUhR0UfiAhL-ISraJgWvdY6StMYrZc6P0kPu2gZesdqUnyvP5GdNQ3jNadu7LIe7oPUJPFKqf4DY1roenNwIK6o8eHHcv55Py_TY5JbggjR9nFmQt3XPmh29WjC7AUTrB4G8JjBI-ONByEjKM-qCdnppgQJZj_yTr8LcdnNW4ocOCX758EDcQ_Xy6qaJpcF04IpOtQDpqTH0_E0urmyXmlKUj6GZXk_WOQk-Q8KLlpYQ1nwiRRuIqNh0Asi0ynhq1-e_C5NzHkEGXFKE4A",
    },
    [USER_ROLES.ORGANISER]: {
      username: "76420294-00e1-700b-74d6-a22a780eeaee",
      accessToken:
        "eyJraWQiOiJNanpzNncva3NZZ01YSzRuYTFFYjczTFY3S2lZVXZBUm5Pak9IUGd5U2djPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWUiLCJjb2duaXRvOmdyb3VwcyI6WyJPcmdhbmlzZXIiXSwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbS9ldS13ZXN0LTJfVTdpUGU2T216IiwiY2xpZW50X2lkIjoiN2cyZzJtNzc4dGNqbTVnY29vdGMyam0wamUiLCJvcmlnaW5fanRpIjoiZTY4ZjQzMWMtNWU2Ni00YjI5LWI0NDEtZjYxZDZkZDU5NWRiIiwiZXZlbnRfaWQiOiIxYjc5YjhlNS1jMmU4LTRmMTMtYjY2Ny1mZTljZTMwNzk2NmEiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzQ0MjE5ODE1LCJleHAiOjE3NDQ0NDc4NDIsImlhdCI6MTc0NDQ0NDI0MiwianRpIjoiMWJlYjM5MDgtMGQ5Ni00MmFlLWFjMzktNzgzNjE2MmRiYTgxIiwidXNlcm5hbWUiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWQifQ.QwQ-nRKZ9V48J9G5YXfXuC7u2NjlieB5x-et2XU2KZMweaEVsMAySL0jzKIejLFwHSkv5Gac8Qa762QcqfendPLpz86DwYpTaUC8Xi7H84VhBr5YNsUW1M_Mywmq88t5aKaaEtYpd_yakMSa_0fde2nRiNj_WN56e5lkle-ouC7sIWDHQUgtV5ATc5pXCrq1bj35c9n4lOaCHaP5dnnjLemTRDRwPFx7uQKpdHv11ZJsuscDA0nuMiCL7YguuKx2Afo_L7k-leDYy0bhem7FgRDkEHfNfkpwyEv67wIzy-7SDRTLATaOoBBTafczch9-OWRc6kuf9LiRhVbGVA6bhA",
    },
    [USER_ROLES.ADMIN]: {
      username: "76420294-00e1-700b-74d6-a22a780eeaed",
      accessToken:
        "eyJraWQiOiJNanpzNncva3NZZ01YSzRuYTFFYjczTFY3S2lZVXZBUm5Pak9IUGd5U2djPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWQiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbiJdLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmV1LXdlc3QtMi5hbWF6b25hd3MuY29tL2V1LXdlc3QtMl9VN2lQZTZPbXoiLCJjbGllbnRfaWQiOiI3ZzJnMm03Nzh0Y2ptNWdjb290YzJqbTBqZSIsIm9yaWdpbl9qdGkiOiJlNjhmNDMxYy01ZTY2LTRiMjktYjQ0MS1mNjFkNmRkNTk1ZGIiLCJldmVudF9pZCI6IjFiNzliOGU1LWMyZTgtNGYxMy1iNjY3LWZlOWNlMzA3OTY2YSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NDQyMTk4MTUsImV4cCI6MTc0NDQ0Nzg0MiwiaWF0IjoxNzQ0NDQ0MjQyLCJqdGkiOiIxYmViMzkwOC0wZDk2LTQyYWUtYWMzOS03ODM2MTYyZGJhODEiLCJ1c2VybmFtZSI6Ijc2NDIwMjk0LTAwZTEtNzAwYi03NGQ2LWEyMmE3ODBlZWFlZCJ9.QwQ-nRKZ9V48J9G5YXfXuC7u2NjlieB5x-et2XU2KZMweaEVsMAySL0jzKIejLFwHSkv5Gac8Qa762QcqfendPLpz86DwYpTaUC8Xi7H84VhBr5YNsUW1M_Mywmq88t5aKaaEtYpd_yakMSa_0fde2nRiNj_WN56e5lkle-ouC7sIWDHQUgtV5ATc5pXCrq1bj35c9n4lOaCHaP5dnnjLemTRDRwPFx7uQKpdHv11ZJsuscDA0nuMiCL7YguuKx2Afo_L7k-leDYy0bhem7FgRDkEHfNfkpwyEv67wIzy-7SDRTLATaOoBBTafczch9-OWRc6kuf9LiRhVbGVA6bhA",
    },
  }[role];

  if (!user) {
    return;
  }

  cy.setCookie(
    `CognitoIdentityServiceProvider.${Cypress.env("NEXT_PUBLIC_USER_POOL_CLIENT_ID")}.LastAuthUser`,
    user.username,
  );
  cy.setCookie(
    `CognitoIdentityServiceProvider.${Cypress.env("NEXT_PUBLIC_USER_POOL_CLIENT_ID")}.${user.username}.accessToken`,
    user.accessToken,
  );
});
