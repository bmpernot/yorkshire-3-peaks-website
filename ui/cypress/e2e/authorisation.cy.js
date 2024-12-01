import authPageClass from "../pages/auth.page.js";

describe("Authorisation", () => {
  const authPage = new authPageClass();

  describe("Signup page", () => {
    it("Should be able to ", () => {});

    it("Should validate input correctly", () => {});

    it("Should handle errors from cognito gracefully", () => {});
  });

  describe("Confirm signup page", () => {
    it("Should be able to ", () => {});

    it("Should validate input correctly", () => {});

    it("Should handle errors from cognito gracefully", () => {});
  });

  describe("Sign in page", () => {
    it("Should be able to ", () => {});

    it("Should validate input correctly", () => {});

    it("Should handle errors from cognito gracefully", () => {});
  });

  describe("Reset Password page", () => {
    it("Should be able to ", () => {});

    it("Should validate input correctly", () => {});

    it("Should handle errors from cognito gracefully", () => {});
  });

  describe("Account page", () => {
    describe("Update user details", () => {
      it("Should be able to ", () => {});

      it("Should validate input correctly", () => {});

      it("Should handle errors from cognito gracefully", () => {});
    });

    describe("Update password", () => {
      it("Should be able to ", () => {});

      it("Should validate input correctly", () => {});

      it("Should handle errors from cognito gracefully", () => {});
    });

    describe("Delete Account", () => {
      it("Should be able to ", () => {});

      it("Should validate input correctly", () => {});

      it("Should handle errors from cognito gracefully", () => {});
    });
  });

  describe("Unauthorised page", () => {
    // TODO - need to generate all the different scenarios
    const scenarios = [{ user: "", pages: [{ page: "", authorised: true }] }];
    for (const user of scenarios) {
      for (const page of user.pages) {
        it(`A ${user.user} should ${page.authorised ? "" : "not "}be able to view the ${page.page} page`, () => {
          // TODO - need to find a way to stub the user

          const expectedURL = page.authorised ? page.page : "unauthorised";
          authPage.open(page.page).urlShouldBe(expectedURL);
        });
      }
    }
  });
});
