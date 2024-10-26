import homePageClass from "../pages/home.page";

describe("NavBar", () => {
  const homePage = new homePageClass();
  describe(
    "NavBar large page",
    {
      viewportWidth: Cypress.env("largeViewportWidth"),
      viewportHeight: Cypress.env("largeViewportHeight"),
    },
    () => {
      it("Should show all pieces of information in the navbar", () => {
        homePage.open().verifyNavBar();
      });

      it("Should be able to navigate though all the pages", () => {
        homePage
          .open()
          .verifyPage("Home")
          .goToPage("Route")
          .verifyPage("Route")
          .goToPage("Rules")
          .verifyPage("Rules")
          .goToPage("Results")
          .verifyPage("Results")
          .goToPage("Organisers")
          .verifyPage("Organisers")
          .goToPage("Admin")
          .verifyPage("Admin")
          .goToPage("SignOut")
          .verifyPage("SignOut")
          .goToPage("Profile")
          .verifyPage("Profile")
          .goToPage("Account")
          .verifyPage("Account")
          .goToPage("Current Event")
          .verifyPage("Event")
          .goToPage("Promotion")
          .verifyPage("Promotion")
          .goToPage("Home")
          .verifyPage("Home");
      });
    },
  );

  describe(
    "NavBar small page",
    {
      viewportWidth: Cypress.env("smallViewportWidth"),
      viewportHeight: Cypress.env("smallViewportHeight"),
    },
    () => {
      it("Should show all pieces of information in the navbar", () => {
        homePage.open().verifyNavBar();
      });

      it("Should be able to navigate though all the pages", () => {
        homePage
          .open()
          .verifyPage("Home")
          .goToPage("Route")
          .verifyPage("Route")
          .goToPage("Rules")
          .verifyPage("Rules")
          .goToPage("Results")
          .verifyPage("Results")
          .goToPage("Organisers")
          .verifyPage("Organisers")
          .goToPage("Admin")
          .verifyPage("Admin")
          .goToPage("SignOut")
          .verifyPage("SignOut")
          .goToPage("Profile")
          .verifyPage("Profile")
          .goToPage("Account")
          .verifyPage("Account")
          .goToPage("Current Event")
          .verifyPage("Event")
          .goToPage("Promotion")
          .verifyPage("Promotion")
          .goToPage("Home")
          .verifyPage("Home");
      });
    },
  );
});
