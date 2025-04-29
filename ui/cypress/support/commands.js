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
    forgotPassword: {
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
    confirmForgotPassword: {
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
      body: {
        UserAttributes: [
          {
            Name: "email",
            Value: "jon.snow@yorkshire3peaks.com",
          },
          {
            Name: "email_verified",
            Value: "true",
          },
          {
            Name: "phone_number",
            Value: "+441234567890",
          },
          {
            Name: "phone_number_verified",
            Value: "false",
          },
          {
            Name: "family_name",
            Value: "Snow",
          },
          {
            Name: "given_name",
            Value: "Jon",
          },
          {
            Name: "custom:ice_number",
            Value: "+44123456789",
          },
          {
            Name: "custom:notify",
            Value: "true",
          },
          {
            Name: "sub",
            Value: "76420294-00e1-700b-74d6-a22a780eeae1",
          },
        ],
        Username: "76420294-00e1-700b-74d6-a22a780eeae1",
      },
    },
    initiateAuth: {
      statusCode: 200,
      body: {
        ChallengeName: "PASSWORD_VERIFIER",
        ChallengeParameters: {
          SALT: "a616f717519fe1438d639bacb116954e",
          SECRET_BLOCK: "AgV4mQQ085mpw6sbXHT3mQbWzn8hcRZpOpHbtHRG923M0GkAewAC",
          SRP_B: "5491d3a8cc546329cf27c254569e3748e36bea3498db054f23d5e938e58",
          USERNAME: "76420294-00e1-700b-74d6-a22a780eeaed",
          USER_ID_FOR_SRP: "76420294-00e1-700b-74d6-a22a780eeaed",
        },
      },
    },
    respondToAuthChallenge: {
      statusCode: 200,
      body: {
        AuthenticationResult: {
          AccessToken:
            "eyJraWQiOiJNanpzNncva3NZZ01YSzRuYTFFYjczTFY3S2lZVXZBUm5Pak9IUGd5U2djPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWQiLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmV1LXdlc3QtMi5hbWF6b25hd3MuY29tL2V1LXdlc3QtMl9VN2lQZTZPbXoiLCJjbGllbnRfaWQiOiI3ZzJnMm03Nzh0Y2ptNWdjb290YzJqbTBqZSIsIm9yaWdpbl9qdGkiOiI4MGU2YWE0YS1lODIzLTRmNjctODJmYi04ZDk4NDJkMmFkNTciLCJldmVudF9pZCI6IjcwYWI1M2QyLTYzNTgtNGE5MS1hNzYzLTMyMjVhZjc4ZWM3NiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIiLCJhdXRoX3RpbWUiOjE3NDQ1NTM3MTAsImV4cCI6MTc0NDU1NzMxMCwiaWF0IjoxNzQ0NTUzNzEwLCJqdGkiOiJlN2Q1ODZjNS03ODYwLTQ3YTktYmI5YS1jNDgyNjFmNzE2YTQiLCJ1c2VybmFtZSI6Ijc2NDIwMjk0LTAwZTEtNzAwYi03NGQ2LWEyMmE3ODBlZWFlZCJ9.F-L-HL-nZVCGLgjuewy-ATDNFL12Agsity_c25INpHhraBceaIgFe5VKO7vHih65a9cgoOtNvaZOwpg5sQhZ1H1ecS-bIFgMl668fb8S0gHyv293IfZBMHwWJ36EI8E3hmJp2g2z3ingLkgAkmX_MHCgFwHjtT_8eItmMLS7X06qzfVRmsv4MxJscNmTK7lYPzIOUeBMVgzupkOJTiSdea3fVactMO7atEXey4keEhYlOnYpyFPgmW_vRy0K-80FqGjOI8Pzy6U8NBVcK-r0ueTb4OVXiHRxD8L8M7htKR5TtbvFZODicvcMVPHjpFUDv6XOoPkVb2Z1BSlBJ4FB7g",
          ExpiresIn: 3600,
          IdToken:
            "eyJraWQiOiJiK0VjVE1IZzNCQzNXQk8vTFpNUTJxd1hDZUlQelArS3ZuemdxOUV3ZUZVPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWQiLCJjdXN0b206aWNlX251bWJlciI6Iis0NDEyMzQ1Njc4OTAiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb20vZXUtd2VzdC0yX1U3aVBlNk5yZCIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImNvZ25pdG86dXNlcm5hbWUiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVkZmUiLCJnaXZlbl9uYW1lIjoiQm9iIiwiY3VzdG9tOm5vdGlmeSI6ImZhbHNlIiwib3JpZ2luX2p0aSI6IjgwZTZhYTRhLWU4MjMtNGY2Ny04MmZiLThkOTg0MmQyYWQ1NyIsImF1ZCI6IjdnMmcybTc3OHRjam01Z2Nvb3RjMmptMGplIiwiZXZlbnRfaWQiOiI3MGFiNTNkMi02MzU4LTRhOTEtYTc2My0zMjI1YWY3OGVjNzYiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0NDU1MzcxMCwicGhvbmVfbnVtYmVyIjoiKzQ0MTIzNDU2Nzg5MCIsImV4cCI6MTc0NDU1NzMxMCwiaWF0IjoxNzQ0NTUzNzEwLCJmYW1pbHlfbmFtZSI6Ik1hcmxleSIsImp0aSI6IjJlZmQxNzQyLTQ0YzUtNDQ2Mi1hOTlhLWYyMmI5OTZmYmIyYyIsImVtYWlsIjoiYm9iLm1hcmxleUBnbWFpbC5jb20ifQ.agTBSVAkEMgzFHU3FnSiGqDdVdpNKD5S4rIr4W9vX8g4JWXu3_hXNABeLWBkKgRrg8x4CV4rqZ1-ey0kKH0o-wO8yae6x9ix-faNvp4gjEospkFzZbUAU7ZHL0F9blIi0emnbcaAqQci2PRI1GBncW5K6QLtezqKJADEkyIZAWufkxqEgDBGVFAMl6QQoiMVGC9Nq4XQBsIC5lhCFTbb_qjXkSMB6x8qrFdYt2FFRBcY2BCfSaG2NGb5F8Be-MIVN9bLj_6mDaSRsrQPJ9sPezGs79Mj9hUAdXsm_ZQyiuqRP5OWkFtYjV2eUx5sGLvjvaLjhuq7t998evbgLIujiA",
          RefreshToken:
            "eyJraWQiOiJiK0VjVE1IZzNCQzNXQk8vTFpNUTJxd1hDZUlQelArS3ZuemdxOUV3ZUZVPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWQiLCJjdXN0b206aWNlX251bWJlciI6Iis0NDEyMzQ1Njc4OTAiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb20vZXUtd2VzdC0yX1U3aVBlNk5yZCIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImNvZ25pdG86dXNlcm5hbWUiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVkZmUiLCJnaXZlbl9uYW1lIjoiQm9iIiwiY3VzdG9tOm5vdGlmeSI6ImZhbHNlIiwib3JpZ2luX2p0aSI6IjgwZTZhYTRhLWU4MjMtNGY2Ny04MmZiLThkOTg0MmQyYWQ1NyIsImF1ZCI6IjdnMmcybTc3OHRjam01Z2Nvb3RjMmptMGplIiwiZXZlbnRfaWQiOiI3MGFiNTNkMi02MzU4LTRhOTEtYTc2My0zMjI1YWY3OGVjNzYiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0NDU1MzcxMCwicGhvbmVfbnVtYmVyIjoiKzQ0MTIzNDU2Nzg5MCIsImV4cCI6MTc0NDU1NzMxMCwiaWF0IjoxNzQ0NTUzNzEwLCJmYW1pbHlfbmFtZSI6Ik1hcmxleSIsImp0aSI6IjJlZmQxNzQyLTQ0YzUtNDQ2Mi1hOTlhLWYyMmI5OTZmYmIyYyIsImVtYWlsIjoiYm9iLm1hcmxleUBnbWFpbC5jb20ifQ.agTBSVAkEMgzFHU3FnSiGqDdVdpNKD5S4rIr4W9vX8g4JWXu3_hXNABeLWBkKgRrg8x4CV4rqZ1-ey0kKH0o-wO8yae6x9ix-faNvp4gjEospkFzZbUAU7ZHL0F9blIi0emnbcaAqQci2PRI1GBncW5K6QLtezqKJADEkyIZAWufkxqEgDBGVFAMl6QQoiMVGC9Nq4XQBsIC5lhCFTbb_qjXkSMB6x8qrFdYt2FFRBcY2BCfSaG2NGb5F8Be-MIVN9bLj_6mDaSRsrQPJ9sPezGs79Mj9hUAdXsm_ZQyiuqRP5OWkFtYjV2eUx5sGLvjvaLjhuq7t998evbgLIujiA",
          TokenType: "Bearer",
        },
        ChallengeParameters: {},
      },
    },
    resendConfirmationCode: {
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
      case "AWSCognitoIdentityProviderService.ConfirmForgotPassword":
        req.reply(mocks.confirmForgotPassword);
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
      case "AWSCognitoIdentityProviderService.InitiateAuth":
        req.reply(mocks.initiateAuth);
        break;
      case "AWSCognitoIdentityProviderService.RespondToAuthChallenge":
        req.reply(mocks.respondToAuthChallenge);
        break;
      case "AWSCognitoIdentityProviderService.ForgotPassword":
        req.reply(mocks.forgotPassword);
        break;
      case "AWSCognitoIdentityProviderService.ResendConfirmationCode":
        req.reply(mocks.resendConfirmationCode);
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
        "eyJraWQiOiJNanpzNncva3NZZ01YSzRuYTFFYjczTFY3S2lZVXZBUm5Pak9IUGd5U2djPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWYiLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmV1LXdlc3QtMi5hbWF6b25hd3MuY29tL2V1LXdlc3QtMl9VN2lQZTZPbXoiLCJjbGllbnRfaWQiOiI3ZzJnMm03Nzh0Y2ptNWdjb290YzJqbTBqZSIsIm9yaWdpbl9qdGkiOiJlNjhmNDMxYy01ZTY2LTRiMjktYjQ0MS1mNjFkNmRkNTk1ZGIiLCJldmVudF9pZCI6IjFiNzliOGU1LWMyZTgtNGYxMy1iNjY3LWZlOWNlMzA3OTY2YSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NDQyMTk4MTUsImV4cCI6OTk5OTk5OTk5OSwiaWF0IjoxNzQ0NDQ0MjQyLCJqdGkiOiIxYmViMzkwOC0wZDk2LTQyYWUtYWMzOS03ODM2MTYyZGJhODkiLCJ1c2VybmFtZSI6Ijc2NDIwMjk0LTAwZTEtNzAwYi03NGQ2LWEyMmE3ODBlZWFlZiJ9.QwQ-nRKZ9V48J9G5YXfXuC7u2NjlieB5x-et2XU2KZMweaEVsMAySL0jzKIejLFwHSkv5Gac8Qa762QcqfendPLpz86DwYpTaUC8Xi7H84VhBr5YNsUW1M_Mywmq88t5aKaaEtYpd_yakMSa_0fde2nRiNj_WN56e5lkle-ouC7sIWDHQUgtV5ATc5pXCrq1bj35c9n4lOaCHaP5dnnjLemTRDRwPFx7uQKpdHv11ZJsuscDA0nuMiCL7YguuKx2Afo_L7k-leDYy0bhem7FgRDkEHfNfkpwyEv67wIzy-7SDRTLATaOoBBTafczch9-OWRc6kuf9LiRhVbGVA6bhA",
      idToken:
        "eyJraWQiOiJ3T3pMM3NLU3Z0bGdONTB5Wk9MUWROa3lkaXVuazQxTGhVNVJaY2xGL0VJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWYiLCJjdXN0b206aWNlX251bWJlciI6Iis0NDEyMzQ1Njc4OTEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbS9ldS13ZXN0LTJfS2l3NW9kWjY4IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6Ijc2NDIwMjk0LTAwZTEtNzAwYi03NGQ2LWEyMmE3ODBlZWFlZCIsImdpdmVuX25hbWUiOiJCcnVjZSIsImN1c3RvbTpub3RpZnkiOiJ0cnVlIiwib3JpZ2luX2p0aSI6ImU4NzY3ZTZhLWQxMTYtNGM2MC1hOTA0LWU0ZjZhMGUxY2MyOSIsImF1ZCI6IjdkNDBoa3AyaWtodXZsZ21zZmcxcnZyZ2phIiwiZXZlbnRfaWQiOiJkY2IyNDE5Mi01YjYxLTRkNzMtYjNlZC03M2MyYzkxYWE2MTIiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0Mzk0NTI2NSwicGhvbmVfbnVtYmVyIjoiKzQ0MTIzNDU2Nzg5MCIsImV4cCI6OTk5OTk5OTk5OSwiaWF0IjoxNzQzOTQ1MjY1LCJmYW1pbHlfbmFtZSI6IldhbnllIiwianRpIjoiOTM0YzRmMGItZDA0ZS00Y2VlLWIzMTEtOWRiZGRjZDVlMDY4IiwiZW1haWwiOiJicnVjZS53YXluZUB5b3Jrc2hpcmUzcGVha3MuY29tIn0.mCJaJkAIRVYvPdmMiGahHH3g61u0WhmmTttrvKuhfOI7okX33Md9l6Ppl_aUyZl42ChiDAhHgXL3EWQMONh8mLDzBEaYa3hOoMJgo3gxTmJ92Gy6giqJ2QsiMHG5DC7KB1HfOWe3uWrdv4BlSy9hlf30b4W-R6xVICvWhzcaEm4MEIchceXEiuAhHsQvLY6OaUQEnGuY2zv1-YvVAbld0J3XUeOQzDmWdT-0dViAzHXFOcZ3tE9ir-X6wd2EYjCjp8KE_BMtpBQwV_cW33VmcL6vslwZW5tU8Qn6A-PXfVRgR4ysUlf5Y1ymh50HbhYOOeEvyp9HkqrW_vWfU3bvYw",
      signInDetails: "{%22loginId%22:%22bruce.wayne@yorkshire3peaks.com%22%2C%22authFlowType%22:%22USER_SRP_AUTH%22}",
    },
    [USER_ROLES.ORGANISER]: {
      username: "76420294-00e1-700b-74d6-a22a780eeaee",
      accessToken:
        "eyJraWQiOiJNanpzNncva3NZZ01YSzRuYTFFYjczTFY3S2lZVXZBUm5Pak9IUGd5U2djPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWUiLCJjb2duaXRvOmdyb3VwcyI6WyJPcmdhbmlzZXIiXSwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbS9ldS13ZXN0LTJfVTdpUGU2T216IiwiY2xpZW50X2lkIjoiN2cyZzJtNzc4dGNqbTVnY29vdGMyam0wamUiLCJvcmlnaW5fanRpIjoiZTY4ZjQzMWMtNWU2Ni00YjI5LWI0NDEtZjYxZDZkZDU5NWRiIiwiZXZlbnRfaWQiOiIxYjc5YjhlNS1jMmU4LTRmMTMtYjY2Ny1mZTljZTMwNzk2NmEiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzQ0MjE5ODE1LCJleHAiOjk5OTk5OTk5OTksImlhdCI6MTc0NDQ0NDI0MiwianRpIjoiMWJlYjM5MDgtMGQ5Ni00MmFlLWFjMzktNzgzNjE2MmRiYTg5IiwidXNlcm5hbWUiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWUifQ.QwQ-nRKZ9V48J9G5YXfXuC7u2NjlieB5x-et2XU2KZMweaEVsMAySL0jzKIejLFwHSkv5Gac8Qa762QcqfendPLpz86DwYpTaUC8Xi7H84VhBr5YNsUW1M_Mywmq88t5aKaaEtYpd_yakMSa_0fde2nRiNj_WN56e5lkle-ouC7sIWDHQUgtV5ATc5pXCrq1bj35c9n4lOaCHaP5dnnjLemTRDRwPFx7uQKpdHv11ZJsuscDA0nuMiCL7YguuKx2Afo_L7k-leDYy0bhem7FgRDkEHfNfkpwyEv67wIzy-7SDRTLATaOoBBTafczch9-OWRc6kuf9LiRhVbGVA6bhA",
      idToken:
        "eyJraWQiOiJ3T3pMM3NLU3Z0bGdONTB5Wk9MUWROa3lkaXVuazQxTGhVNVJaY2xGL0VJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWUiLCJjdXN0b206aWNlX251bWJlciI6Iis0NDEyMzQ1Njc4OTEiLCJjb2duaXRvOmdyb3VwcyI6WyJPcmdhbmlzZXIiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb20vZXUtd2VzdC0yX0tpdzVvZFo2OCIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImNvZ25pdG86dXNlcm5hbWUiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWQiLCJnaXZlbl9uYW1lIjoiQ2xhcmsiLCJjdXN0b206bm90aWZ5IjoiZmFsc2UiLCJvcmlnaW5fanRpIjoiZTg3NjdlNmEtZDExNi00YzYwLWE5MDQtZTRmNmEwZTFjYzI5IiwiYXVkIjoiN2Q0MGhrcDJpa2h1dmxnbXNmZzFydnJnamEiLCJldmVudF9pZCI6ImRjYjI0MTkyLTViNjEtNGQ3My1iM2VkLTczYzJjOTFhYTYxMiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQzOTQ1MjY1LCJwaG9uZV9udW1iZXIiOiIrNDQxMjM0NTY3ODkwIiwiZXhwIjo5OTk5OTk5OTk5LCJpYXQiOjE3NDM5NDUyNjUsImZhbWlseV9uYW1lIjoiS2VudCIsImp0aSI6IjkzNGM0ZjBiLWQwNGUtNGNlZS1iMzExLTlkYmRkY2Q1ZTA2OCIsImVtYWlsIjoiY2xhcmsua2VudEB5b3Jrc2hpcmUzcGVha3MuY29tIn0.mCJaJkAIRVYvPdmMiGahHH3g61u0WhmmTttrvKuhfOI7okX33Md9l6Ppl_aUyZl42ChiDAhHgXL3EWQMONh8mLDzBEaYa3hOoMJgo3gxTmJ92Gy6giqJ2QsiMHG5DC7KB1HfOWe3uWrdv4BlSy9hlf30b4W-R6xVICvWhzcaEm4MEIchceXEiuAhHsQvLY6OaUQEnGuY2zv1-YvVAbld0J3XUeOQzDmWdT-0dViAzHXFOcZ3tE9ir-X6wd2EYjCjp8KE_BMtpBQwV_cW33VmcL6vslwZW5tU8Qn6A-PXfVRgR4ysUlf5Y1ymh50HbhYOOeEvyp9HkqrW_vWfU3bvYw",
      signInDetails: "{%22loginId%22:%22clake.kent@yorkshire3peaks.com%22%2C%22authFlowType%22:%22USER_SRP_AUTH%22}",
    },
    [USER_ROLES.ADMIN]: {
      username: "76420294-00e1-700b-74d6-a22a780eeaed",
      accessToken:
        "eyJraWQiOiJNanpzNncva3NZZ01YSzRuYTFFYjczTFY3S2lZVXZBUm5Pak9IUGd5U2djPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWQiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbiJdLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmV1LXdlc3QtMi5hbWF6b25hd3MuY29tL2V1LXdlc3QtMl9VN2lQZTZPbXoiLCJjbGllbnRfaWQiOiI3ZzJnMm03Nzh0Y2ptNWdjb290YzJqbTBqZSIsIm9yaWdpbl9qdGkiOiJlNjhmNDMxYy01ZTY2LTRiMjktYjQ0MS1mNjFkNmRkNTk1ZGIiLCJldmVudF9pZCI6IjFiNzliOGU1LWMyZTgtNGYxMy1iNjY3LWZlOWNlMzA3OTY2YSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NDQyMTk4MTUsImV4cCI6OTk5OTk5OTk5OSwiaWF0IjoxNzQ0NDQ0MjQyLCJqdGkiOiIxYmViMzkwOC0wZDk2LTQyYWUtYWMzOS03ODM2MTYyZGJhODkiLCJ1c2VybmFtZSI6Ijc2NDIwMjk0LTAwZTEtNzAwYi03NGQ2LWEyMmE3ODBlZWFlZCJ9.QwQ-nRKZ9V48J9G5YXfXuC7u2NjlieB5x-et2XU2KZMweaEVsMAySL0jzKIejLFwHSkv5Gac8Qa762QcqfendPLpz86DwYpTaUC8Xi7H84VhBr5YNsUW1M_Mywmq88t5aKaaEtYpd_yakMSa_0fde2nRiNj_WN56e5lkle-ouC7sIWDHQUgtV5ATc5pXCrq1bj35c9n4lOaCHaP5dnnjLemTRDRwPFx7uQKpdHv11ZJsuscDA0nuMiCL7YguuKx2Afo_L7k-leDYy0bhem7FgRDkEHfNfkpwyEv67wIzy-7SDRTLATaOoBBTafczch9-OWRc6kuf9LiRhVbGVA6bhA",
      idToken:
        "eyJraWQiOiJ3T3pMM3NLU3Z0bGdONTB5Wk9MUWROa3lkaXVuazQxTGhVNVJaY2xGL0VJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NjQyMDI5NC0wMGUxLTcwMGItNzRkNi1hMjJhNzgwZWVhZWQiLCJjdXN0b206aWNlX251bWJlciI6Iis0NDEyMzQ1Njc4OTEiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbiJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbS9ldS13ZXN0LTJfS2l3NW9kWjY4IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6Ijc2NDIwMjk0LTAwZTEtNzAwYi03NGQ2LWEyMmE3ODBlZWFlZCIsImdpdmVuX25hbWUiOiJMYXJhIiwiY3VzdG9tOm5vdGlmeSI6ImZhbHNlIiwib3JpZ2luX2p0aSI6ImU4NzY3ZTZhLWQxMTYtNGM2MC1hOTA0LWU0ZjZhMGUxY2MyOSIsImF1ZCI6IjdkNDBoa3AyaWtodXZsZ21zZmcxcnZyZ2phIiwiZXZlbnRfaWQiOiJkY2IyNDE5Mi01YjYxLTRkNzMtYjNlZC03M2MyYzkxYWE2MTIiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0Mzk0NTI2NSwicGhvbmVfbnVtYmVyIjoiKzQ0MTIzNDU2Nzg5MCIsImV4cCI6OTk5OTk5OTk5OSwiaWF0IjoxNzQzOTQ1MjY1LCJmYW1pbHlfbmFtZSI6IkNyb2Z0IiwianRpIjoiOTM0YzRmMGItZDA0ZS00Y2VlLWIzMTEtOWRiZGRjZDVlMDY4IiwiZW1haWwiOiJsYXJhLmNyb2Z0QHlvcmtzaGlyZTNwZWFrcy5jb20ifQ.mCJaJkAIRVYvPdmMiGahHH3g61u0WhmmTttrvKuhfOI7okX33Md9l6Ppl_aUyZl42ChiDAhHgXL3EWQMONh8mLDzBEaYa3hOoMJgo3gxTmJ92Gy6giqJ2QsiMHG5DC7KB1HfOWe3uWrdv4BlSy9hlf30b4W-R6xVICvWhzcaEm4MEIchceXEiuAhHsQvLY6OaUQEnGuY2zv1-YvVAbld0J3XUeOQzDmWdT-0dViAzHXFOcZ3tE9ir-X6wd2EYjCjp8KE_BMtpBQwV_cW33VmcL6vslwZW5tU8Qn6A-PXfVRgR4ysUlf5Y1ymh50HbhYOOeEvyp9HkqrW_vWfU3bvYw",
      signInDetails: "{%22loginId%22:%22lara.croft@yorkshire3peaks.com%22%2C%22authFlowType%22:%22USER_SRP_AUTH%22}",
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
  cy.setCookie(
    `CognitoIdentityServiceProvider.${Cypress.env("NEXT_PUBLIC_USER_POOL_CLIENT_ID")}.${user.username}.clockDrift`,
    "-1000",
  );
  cy.setCookie(
    `CognitoIdentityServiceProvider.${Cypress.env("NEXT_PUBLIC_USER_POOL_CLIENT_ID")}.${user.username}.idToken`,
    user.idToken,
  );
  cy.setCookie(
    `CognitoIdentityServiceProvider.${Cypress.env("NEXT_PUBLIC_USER_POOL_CLIENT_ID")}.${user.username}.refreshToken`,
    "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.Ah3MR8JvnGMsryvXN2X60Hzki4l-tYI4h6czonJCH3s82LZL0m2dALmSgtHy71TdKbA6B44E0hfcX2EL189o8ZumvQeiWJe4k1gsv-WbgcUN8N1rc_JQkXNsgnKZ88iNiP6UdvL7C8u_Yu-az_ew7x7dQwgVDJVbiVr0dWF_1Y9t_i1EUVJ7jTFjMDp7G5bx1avRKAPP1aUoi0fLBS80yV5U4FAP9nCItvKjNwatyoDilzPbLLDhKwrGNCbO2WaieP8YOcrWsdd_zuTjlv2W_gQ5fuTTKunePJp7MdauoI4cCm_AqnQDiSNTRiFTa_nqxmaDUgJ9ogtp1Sxo7JtGxg.01bUlM2l18zE36n2.UIpb1sBbwrvZaveCgRREpNThhoD0sHWMorCLl8Y5GGRBo8gL3AbIjgpyqipFsQnUpqz0ws2nDKP1gC-USxY6eIcVK8k3-U-NqZplhtWNu1h5yznIq0LEH3rb_cnYSS7ZusEMihD2I5eUYjyYfkCi15pga2sPpb_K0uJuFyoEQABZWhEeRSPhkcojbwYEYELCKwls673MT2BsFKJwMx2jmYyRDSqEgXv4Pfc8FEX9LXf3COQppEEZcgkOUKlwpBYGIz6-JA52ZsrjGPjP8VKFSldVA9Bg8rsrAH0TpQimbcmrT8JAVZvgDk_pUBGfUeva9YFU3QhboCqkXohyLCcX8MTeSEnkhDT76AT6NvGEkUPuHzI71m6_fiq0saRz0cFTPm1OXF4jKWmH65tqVZA7Cb-tVFtXviWyXSi2xXAtctB7TDGjt8hrcVUU149c4_THhr6C-6MbelYbMnmzhHOfDkKLNJuKB6lDSx5uCqCzaGRb3oz9ht9O22u9g1bsGSi3h6o5lpULIwnhvPICjsbJVzoFsSiScOTdo9I_d85HzJmmjEnGoD_yqoPkLSfwXoohXMZZAwXvOOGZenQe7fOqqG5sOWfczUq_m0kmGdvlT-qdPza0pl18J5V5WQQT_lu1ub3hCyBof5pFyTUXnuWI5svl3xUniKfDYdYrRxSPS0pYguWWQwtxOU__mliuphigeGqPoqlAdzI6BB4a4TFWDaZ0zVeniPSWBvhvHY0MSBu2rI2trzGGmXVfRQrUS4VlrZ9Nq2x0uvqlCMHR6fCwqFwneF7tpymQwWtf1mujzoEcAQfTc89WUWeKobs9P3p_LvGA76uS1fEuw424imhJlX8Dh2hQ3l-z2Mo5MELv853kfYZ7LLxD5OnnGor-DYAfKTD0T2Sy3OUdCpTsGETq0aN-J6elTBfz2h7XZ4EfR6Q2_Tzcmgg04f-6p8j1Vu82FB7sX5imUnC4BgRYeJkEuAmU7hJxA8oTzaEFiWsN-q2RpP6pamNdB6e6uUK1-5iRLSmJVyx3w2wzWwY4v34EtUWQchTARzB7tv71SujxDWcOoWUk8ZNpnwiqCeCImEjETScxOfnsGxb2oAyxXVAgjzXezo4vZikoJdDNXaEtjaPvgQnER1YtvEcE6gPncTmCoxq7EPAHVFfS03iNVcnR41a0Ao4l0EtGQ_qcBP4UVSVYMWUXCoB3ZJlu031MpzSdBRa9GN07hAP4UPw9lP2QBdQW6Ljx4NzK9c9rYHSqkLsigca6GxZv3IJ2u9LoHSh-Fczxe9fMj8RDWfTkj76wu-asrBPCjDoGTip-e_p65CDdvPG_wnGNpuFH59w.uoP3ZSmV3S4qGGlYec8EnQ",
  );
  cy.setCookie(
    `CognitoIdentityServiceProvider.${Cypress.env("NEXT_PUBLIC_USER_POOL_CLIENT_ID")}.${user.username}.signInDetails`,
    user.signInDetails,
  );
});
