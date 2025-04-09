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
          expect(interception.response.statusCode).to.equal(400);
          expect(interception.response.body).to.include(response.body);
        })
        .urlShouldBe("auth/sign-up")
        .verifyToast("An Error occurred when trying to sign you up")
        .verifyFormError("Invalid message");
    });
  });

  describe("Confirm sign up page", () => {
    it("Should be able to allow the user to confirm there account via their email confirmation code", () => {});

    it("Should validate input correctly", () => {});

    it("Should handle errors from cognito gracefully", () => {});
  });

  describe("Sign in page", () => {
    it("Should be able to should allow the user to sign in", () => {});

    it("Should validate input correctly", () => {});

    it("Should handle errors from cognito gracefully", () => {});
  });

  describe("Reset Password page", () => {
    it("Should be able to allow the user to request their password to be reset", () => {});

    it("Should be able to allow the user to use the code from the reset password email to be able to reset their password", () => {});

    it("Should validate input correctly", () => {});

    it("Should handle errors from cognito gracefully", () => {});
  });

  describe("Account page", () => {
    describe("Update user details", () => {
      it("Should be able to allow the user to update their details", () => {});

      it("Should validate input correctly", () => {});

      it("Should handle errors from cognito gracefully", () => {});
    });

    describe("Update password", () => {
      it("Should be able to allow the user to update their password", () => {});

      it("Should validate input correctly", () => {});

      it("Should handle errors from cognito gracefully", () => {});
    });

    describe("Delete Account", () => {
      it("Should be able to allow the user to delete their details", () => {});

      it("Should validate input correctly", () => {});

      it("Should handle errors from cognito gracefully", () => {});
    });
  });

  describe.only("Unauthorised page", () => {
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

    for (const user of scenarios) {
      for (const page of user.pages) {
        it(`A ${user.user} should ${page.authorised ? "" : "not "}be able to view the ${page.page} page`, () => {
          // TODO - need to find a way to stub the user - need to do session on the server first

          const expectedURL = page.authorised ? page.page : "unauthorised";
          authPage.open(page.page).urlShouldBe(expectedURL);
        });
      }
    }
  });
});
