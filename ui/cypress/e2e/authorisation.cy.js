import authPageClass from "../pages/auth.page.js";
import { USER_ROLES } from "../../src/lib/constants.mjs";

describe("Authorisation", () => {
  const authPage = new authPageClass();

  beforeEach(() => {
    cy.interceptAmplifyAuth();
  });

  describe("Sign up page", () => {
    beforeEach(() => {
      authPage.open("auth/sign-up");
    });

    const signupData = {
      firstName: "Jon",
      lastName: "Snow",
      number: "07484048733",
      iceNumber: "07740139354",
      email: "jon.snow@example.com",
      password: "Password1!",
      confirmPassword: "Password1!",
      notify: true,
    };

    it("Should allow the user to sign up", () => {
      authPage
        .fillSignupForm(signupData)
        .submitForm()
        .waitForThen("@amplifyAuthRequest", (interception) => {
          expect(interception.request.headers["x-amz-target"]).to.equal("AWSCognitoIdentityProviderService.SignUp");
          expect(interception.request.body).to.include({
            Username: signupData.email,
            Password: signupData.password,
          });
          expect(interception.request.body.UserAttributes).to.deep.equal([
            {
              Name: "phone_number",
              Value: "+447484048733",
            },
            {
              Name: "email",
              Value: "jon.snow@example.com",
            },
            {
              Name: "given_name",
              Value: "Jon",
            },
            {
              Name: "family_name",
              Value: "Snow",
            },
            {
              Name: "custom:notify",
              Value: "true",
            },
            {
              Name: "custom:ice_number",
              Value: "+447740139354",
            },
          ]);
        })
        .urlShouldBe("auth/confirm-signup");
    });

    it("Should validate inputs correctly", () => {
      authPage
        .submitForm()
        .verifyIfApiHasBeenCalled("@amplifyAuthRequest", false)
        .checkValidationMessages([
          { field: "fname", errors: ["First name is required."] },
          { field: "lname", errors: ["Last name is required."] },
          {
            field: "number",
            errors: ["Number is required.", "Number needs to be a valid GB mobile number, landlines not accepted."],
          },
          {
            field: "iceNumber",
            errors: [
              "ICE number is required.",
              "ICE number cannot be your own.",
              "ICE number needs to be a valid GB mobile number, landlines not accepted.",
            ],
          },
          { field: "email", errors: ["Please enter a valid email address."] },
          {
            field: "password",
            errors: [
              "Password must be at least 8 characters long.",
              "Password must have a upper case letter.",
              "Password must have a lower case letter.",
              "Password must have a number.",
              "Password must have special characters.",
            ],
          },
          { field: "confirmPassword", errors: ["Passwords do not match."] },
        ])
        .fillSignupForm({ firstName: signupData.firstName })
        .submitForm()
        .verifyIfApiHasBeenCalled("@amplifyAuthRequest", false)
        .checkNoValidationMessages(["fname"])
        .clearInputs(["fname"])
        .fillSignupForm({ lastName: signupData.lastName })
        .submitForm()
        .verifyIfApiHasBeenCalled("@amplifyAuthRequest", false)
        .checkNoValidationMessages(["lname"])
        .clearInputs(["lname"])
        .fillSignupForm({ number: signupData.number })
        .submitForm()
        .verifyIfApiHasBeenCalled("@amplifyAuthRequest", false)
        .checkNoValidationMessages(["number"])
        .clearInputs(["number"])
        .fillSignupForm({ iceNumber: signupData.iceNumber })
        .submitForm()
        .verifyIfApiHasBeenCalled("@amplifyAuthRequest", false)
        .checkNoValidationMessages(["iceNumber"])
        .clearInputs(["iceNumber"])
        .fillSignupForm({ email: signupData.email })
        .submitForm()
        .verifyIfApiHasBeenCalled("@amplifyAuthRequest", false)
        .checkNoValidationMessages(["email"])
        .clearInputs(["email"])
        .fillSignupForm({ password: signupData.password })
        .submitForm()
        .verifyIfApiHasBeenCalled("@amplifyAuthRequest", false)
        .checkNoValidationMessages(["password"])
        .fillSignupForm({ confirmPassword: signupData.confirmPassword })
        .submitForm()
        .verifyIfApiHasBeenCalled("@amplifyAuthRequest", false)
        .checkNoValidationMessages(["confirmPassword"])
        .clearInputs(["password", "confirmPassword"])
        .fillSignupForm(signupData)
        .submitForm()
        .waitForThen("@amplifyAuthRequest", (interception) => {
          expect(interception.request.headers["x-amz-target"]).to.equal("AWSCognitoIdentityProviderService.SignUp");
          expect(interception.request.body).to.include({
            Username: signupData.email,
            Password: signupData.password,
          });
          expect(interception.request.body.UserAttributes).to.deep.equal([
            {
              Name: "phone_number",
              Value: "+447484048733",
            },
            {
              Name: "email",
              Value: "jon.snow@example.com",
            },
            {
              Name: "given_name",
              Value: "Jon",
            },
            {
              Name: "family_name",
              Value: "Snow",
            },
            {
              Name: "custom:notify",
              Value: "true",
            },
            {
              Name: "custom:ice_number",
              Value: "+447740139354",
            },
          ]);
        })
        .urlShouldBe("auth/confirm-signup");
    });

    it("Should handle Cognito errors gracefully", () => {
      const response = {
        statusCode: 400,
        body: { __type: "Invalid type", message: "Invalid message" },
      };
      cy.interceptAmplifyAuth({
        signUp: response,
      });

      authPage
        .fillSignupForm(signupData)
        .submitForm()
        .waitForThen("@amplifyAuthRequest")
        .urlShouldBe("auth/sign-up")
        .verifyToast("An error occurred when trying to sign you up")
        .verifyFormError("Invalid message")
        .verifyToast("An error occurred when trying to sign you up");
    });
  });

  describe("Confirm sign up page", () => {
    const email = "bruce.wayne@yorkshire3peaks.com";
    beforeEach(() => {
      authPage.open(`auth/confirm-signup?email=${email}`);
    });

    it("Should be able to allow the user to confirm there account via their email confirmation code", () => {
      const code = "123456";

      authPage
        .fillConfirmSignupForm(code)
        .submitForm()
        .waitForThen("@amplifyAuthRequest", (interception) => {
          expect(interception.request.headers["x-amz-target"]).to.equal(
            "AWSCognitoIdentityProviderService.ConfirmSignUp",
          );
          expect(interception.request.body).to.include({
            Username: email,
            ConfirmationCode: code,
          });
        })
        .urlShouldBe("auth/sign-in");
    });

    it("Should be able to allow the user to resend the code", () => {
      authPage
        .resendCode()
        .waitForThen("@amplifyAuthRequest", (interception) => {
          expect(interception.request.headers["x-amz-target"]).to.equal(
            "AWSCognitoIdentityProviderService.ResendConfirmationCode",
          );
          expect(interception.request.body).to.include({
            Username: email,
          });
        })
        .verifyToast("New code sent to bruce.wayne@yorkshire3peaks.com.");
    });

    it("Should validate input correctly", () => {
      authPage
        .submitForm()
        .checkValidationMessages([{ field: "code", errors: ["Please enter a valid code."] }])
        .fillConfirmSignupForm(" ")
        .submitForm()
        .checkValidationMessages([{ field: "code", errors: ["Please enter a valid code."] }])
        .fillConfirmSignupForm("12345")
        .submitForm()
        .checkValidationMessages([{ field: "code", errors: ["Please enter a valid code."] }])
        .fillConfirmSignupForm("abcdef")
        .submitForm()
        .checkValidationMessages([{ field: "code", errors: ["Please enter a valid code."] }])
        .fillConfirmSignupForm("123456")
        .submitForm()
        .urlShouldBe("auth/sign-in");
    });

    it("Should handle errors from cognito gracefully", () => {
      const response = {
        statusCode: 400,
        body: { __type: "Invalid type", message: "Invalid code" },
      };
      cy.interceptAmplifyAuth({
        confirmSignUp: response,
      });

      authPage
        .fillConfirmSignupForm("123456")
        .submitForm()
        .waitForThen("@amplifyAuthRequest")
        .verifyFormError(response.body.message)
        .urlShouldBe("auth/confirm-signup")
        .verifyToast("An error occurred when trying to confirm your account.");
    });
  });

  describe("Sign in page", () => {
    beforeEach(() => {
      authPage.open("auth/sign-in");
    });

    const signinData = {
      email: "jon.snow@yorkshire3peaks.com",
      password: "Password1!",
    };

    it("Should be able to should allow the user to sign in", () => {
      authPage
        .fillSigninForm(signinData)
        .submitForm()
        .waitForThen("@amplifyAuthRequest", (interception) => {
          expect(interception.request.headers["x-amz-target"]).to.equal(
            "AWSCognitoIdentityProviderService.InitiateAuth",
          );
          expect(interception.request.body.AuthParameters).to.include({
            USERNAME: signinData.email,
          });
        })
        .waitForThen("@amplifyAuthRequest", (interception) => {
          expect(interception.request.headers["x-amz-target"]).to.equal(
            "AWSCognitoIdentityProviderService.RespondToAuthChallenge",
          );
        })
        .waitForThen("@amplifyAuthRequest", (interception) => {
          expect(interception.request.headers["x-amz-target"]).to.equal("AWSCognitoIdentityProviderService.GetUser");
        })
        .urlShouldBe("auth/sign-in");
    });

    it("Should validate input correctly", () => {
      authPage
        .submitForm()
        .checkValidationMessages([{ field: "email", errors: ["Please enter a valid email address."] }])
        .fillSigninForm({ email: "qwerty", password: "Password!1" })
        .submitForm()
        .checkValidationMessages([{ field: "email", errors: ["Please enter a valid email address."] }])
        .fillSigninForm(signinData)
        .submitForm()
        .waitForThen("@amplifyAuthRequest")
        .waitForThen("@amplifyAuthRequest")
        .waitForThen("@amplifyAuthRequest")
        .urlShouldBe("auth/sign-in");
    });

    it("Should handle errors from cognito gracefully", () => {
      const response = {
        statusCode: 400,
        body: { __type: "Invalid type", message: "Invalid password" },
      };
      cy.interceptAmplifyAuth({
        initiateAuth: response,
      });

      authPage
        .fillSigninForm(signinData)
        .submitForm()
        .waitForThen("@amplifyAuthRequest")
        .verifyFormError(response.body.message)
        .urlShouldBe("auth/sign-in")
        .verifyToast("An error occurred when trying to sign you in");
    });
  });

  describe("Reset password", () => {
    const email = "jon.snow@yorkshire3peaks.com";
    const code = "123456";

    describe("Reset password form", () => {
      beforeEach(() => {
        authPage.open("auth/sign-in");
      });

      it("Should be able to allow the user to request their password to be reset", () => {
        authPage
          .fillForgotPasswordForm(true, email)
          .submitResetPasswordForm()
          .waitForThen("@amplifyAuthRequest", (interception) => {
            expect(interception.request.headers["x-amz-target"]).to.equal(
              "AWSCognitoIdentityProviderService.ForgotPassword",
            );
            expect(interception.request.body).to.include({
              Username: email,
            });
          })
          .urlShouldBe("auth/reset-password")
          .verifyToast(
            "We've sent an email to jon.snow@yorkshire3peaks.com with your validation code to reset password",
          );
      });

      it("Should validate input correctly", () => {
        authPage
          .fillForgotPasswordForm(true)
          .submitResetPasswordForm()
          .checkValidationMessages([{ field: "email", errors: ["Please enter a valid email address."] }])
          .fillForgotPasswordForm(false, "qwerty")
          .submitResetPasswordForm()
          .checkValidationMessages([{ field: "email", errors: ["Please enter a valid email address."] }])
          .fillForgotPasswordForm(false, email)
          .submitResetPasswordForm()
          .checkValidationMessages([{ field: "email", errors: ["Please enter a valid email address."] }])
          .waitForThen("@amplifyAuthRequest")
          .urlShouldBe("auth/reset-password");
      });

      it("Should handle errors from cognito gracefully", () => {
        const response = {
          statusCode: 400,
          body: { __type: "Invalid type", message: "Something went wrong" },
        };
        cy.interceptAmplifyAuth({
          forgotPassword: response,
        });

        authPage
          .fillForgotPasswordForm(true, email)
          .submitResetPasswordForm()
          .waitForThen("@amplifyAuthRequest")
          .verifyFormError(response.body.message)
          .urlShouldBe("auth/sign-in")
          .verifyToast(
            "An error occurred when trying to send your validation code to reset your password to jon.snow@yorkshire3peaks.com",
          );
      });
    });

    describe("Confirm password rest form", () => {
      beforeEach(() => {
        authPage.open(`auth/reset-password?email=${email}`);
      });

      it("Should be able to allow the user to use the code from the reset password email to be able to reset their password", () => {
        authPage
          .fillConfirmResetPasswordForm({ code, password: "Password!1" })
          .submitForm()
          .waitForThen("@amplifyAuthRequest", (interception) => {
            expect(interception.request.headers["x-amz-target"]).to.equal(
              "AWSCognitoIdentityProviderService.ConfirmForgotPassword",
            );
            expect(interception.request.body).to.include({
              Username: "jon.snow@yorkshire3peaks.com",
              ConfirmationCode: "123456",
              Password: "Password!1",
            });
          })
          .urlShouldBe("auth/sign-in");
      });

      it("Should be able to allow the user to resend the code", () => {
        authPage
          .resendCode()
          .waitForThen("@amplifyAuthRequest", (interception) => {
            expect(interception.request.headers["x-amz-target"]).to.equal(
              "AWSCognitoIdentityProviderService.ForgotPassword",
            );
            expect(interception.request.body).to.include({
              Username: email,
            });
          })
          .verifyToast("New code sent to jon.snow@yorkshire3peaks.com.");
      });

      it("Should validate input correctly", () => {
        authPage
          .submitForm()
          .checkValidationMessages([
            { field: "code", errors: ["Please enter a valid code."] },
            {
              field: "password",
              errors: [
                "Password must be at least 8 characters long.",
                "Password must have a upper case letter.",
                "Password must have a lower case letter.",
                "Password must have a number.",
                "Password must have special characters.",
              ],
            },
            { field: "confirmPassword", errors: ["Passwords do not match."] },
          ])
          .fillConfirmResetPasswordForm({ code, password: "Password!1" })
          .submitForm()
          .waitForThen("@amplifyAuthRequest")
          .urlShouldBe("auth/sign-in");
      });

      it("Should handle errors from cognito gracefully", () => {
        const response = {
          statusCode: 400,
          body: { __type: "Invalid type", message: "Invalid code" },
        };
        cy.interceptAmplifyAuth({
          confirmForgotPassword: response,
        });

        authPage
          .fillConfirmResetPasswordForm({ code, password: "Password!1" })
          .submitForm()
          .waitForThen("@amplifyAuthRequest")
          .verifyFormError(response.body.message)
          .urlShouldBe("auth/reset-password")
          .verifyToast("An error occurred when trying to reset your password");
      });
    });
  });

  describe.skip("Account page", () => {
    beforeEach(() => {
      authPage.open("user/account");
    });

    describe("Update user details", () => {
      it("Should be able to allow the user to update their details", () => {});

      it("Should validate input correctly", () => {});

      it("Should handle errors from cognito gracefully", () => {
        const response = {
          statusCode: 400,
          body: { __type: "Invalid type", message: "Invalid code" },
        };
        cy.interceptAmplifyAuth({
          confirmSignUp: response,
        });

        authPage
          .fillConfirmSignupForm("123456")
          .submitForm()
          .waitForThen("@amplifyAuthRequest")
          .verifyFormError(response.body.message)
          .urlShouldBe("auth/confirm-signup");
      });
    });

    describe("Update password", () => {
      it("Should be able to allow the user to update their password", () => {});

      it("Should validate input correctly", () => {});

      it("Should handle errors from cognito gracefully", () => {
        const response = {
          statusCode: 400,
          body: { __type: "Invalid type", message: "Invalid code" },
        };
        cy.interceptAmplifyAuth({
          confirmSignUp: response,
        });

        authPage
          .fillConfirmSignupForm("123456")
          .submitForm()
          .waitForThen("@amplifyAuthRequest")
          .verifyFormError(response.body.message)
          .urlShouldBe("auth/confirm-signup");
      });
    });

    describe("Delete Account", () => {
      it("Should be able to allow the user to delete their details", () => {});

      it("Should validate input correctly", () => {});

      it("Should handle errors from cognito gracefully", () => {
        const response = {
          statusCode: 400,
          body: { __type: "Invalid type", message: "Invalid code" },
        };
        cy.interceptAmplifyAuth({
          confirmSignUp: response,
        });

        authPage
          .fillConfirmSignupForm("123456")
          .submitForm()
          .waitForThen("@amplifyAuthRequest")
          .verifyFormError(response.body.message)
          .urlShouldBe("auth/confirm-signup");
      });
    });
  });

  describe("Unauthorised page", () => {
    const scenarios = [
      {
        user: USER_ROLES.GUEST,
        pages: [
          { page: "", authorised: true },
          { page: "admin", authorised: false },
          { page: "organiser", authorised: false },
          { page: "user/account", authorised: false },
          { page: "user/profile", authorised: false },
          { page: "auth/confirm-signup", authorised: true },
          { page: "auth/reset-password", authorised: true },
          { page: "auth/sign-in", authorised: true },
          { page: "auth/sign-up", authorised: true },
          { page: "event/current", authorised: true },
          { page: "event/promotion", authorised: true },
          { page: "event/results", authorised: true },
          { page: "event/route", authorised: true },
          { page: "event/rules", authorised: true },
        ],
      },
      {
        user: USER_ROLES.USER,
        pages: [
          { page: "", authorised: true },
          { page: "admin", authorised: false },
          { page: "organiser", authorised: false },
          { page: "user/account", authorised: true },
          { page: "user/profile", authorised: true },
          { page: "auth/confirm-signup", authorised: true },
          { page: "auth/reset-password", authorised: true },
          { page: "auth/sign-in", authorised: true },
          { page: "auth/sign-up", authorised: true },
          { page: "event/current", authorised: true },
          { page: "event/promotion", authorised: true },
          { page: "event/results", authorised: true },
          { page: "event/route", authorised: true },
          { page: "event/rules", authorised: true },
        ],
      },
      {
        user: USER_ROLES.ORGANISER,
        pages: [
          { page: "", authorised: true },
          { page: "admin", authorised: false },
          { page: "organiser", authorised: true },
          { page: "user/account", authorised: true },
          { page: "user/profile", authorised: true },
          { page: "auth/confirm-signup", authorised: true },
          { page: "auth/reset-password", authorised: true },
          { page: "auth/sign-in", authorised: true },
          { page: "auth/sign-up", authorised: true },
          { page: "event/current", authorised: true },
          { page: "event/promotion", authorised: true },
          { page: "event/results", authorised: true },
          { page: "event/route", authorised: true },
          { page: "event/rules", authorised: true },
        ],
      },
      {
        user: USER_ROLES.ADMIN,
        pages: [
          { page: "", authorised: true },
          { page: "admin", authorised: true },
          { page: "organiser", authorised: true },
          { page: "user/account", authorised: true },
          { page: "user/profile", authorised: true },
          { page: "auth/confirm-signup", authorised: true },
          { page: "auth/reset-password", authorised: true },
          { page: "auth/sign-in", authorised: true },
          { page: "auth/sign-up", authorised: true },
          { page: "event/current", authorised: true },
          { page: "event/promotion", authorised: true },
          { page: "event/results", authorised: true },
          { page: "event/route", authorised: true },
          { page: "event/rules", authorised: true },
        ],
      },
    ];

    for (const scenario of scenarios) {
      for (const page of scenario.pages) {
        it(`A ${scenario.user} should ${page.authorised ? "" : "not "}be able to view the ${page.page} page`, () => {
          cy.stubUser(scenario.user);

          const expectedURL = page.authorised ? page.page : "unauthorised";
          authPage.open(page.page).urlShouldBe(expectedURL);
        });
      }
    }
  });
});
