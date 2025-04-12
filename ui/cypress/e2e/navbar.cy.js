import homePageClass from "../pages/home.page";
import { USER_ROLES } from "../../src/lib/constants.mjs";

describe("NavBar", () => {
  const homePage = new homePageClass();
  const screenSizes = [
    {
      name: "large page",
      viewportWidth: Cypress.env("largeViewportWidth"),
      viewportHeight: Cypress.env("largeViewportHeight"),
    },
    {
      name: "small page",
      viewportWidth: Cypress.env("smallViewportWidth"),
      viewportHeight: Cypress.env("smallViewportHeight"),
    },
  ];

  beforeEach(() => {
    cy.interceptAmplifyAuth();
  });

  for (const screenSize of screenSizes) {
    describe(
      `NavBar ${screenSize.name}`,
      {
        viewportWidth: screenSize.viewportWidth,
        viewportHeight: screenSize.viewportHeight,
      },
      () => {
        it("Should show all pieces of information in the navbar", () => {
          cy.stubUser(USER_ROLES.ADMIN);

          homePage.open(USER_ROLES.ADMIN).verifyNavBar();
        });

        it("Should be able to navigate though all the pages", () => {
          cy.stubUser(USER_ROLES.ADMIN);

          homePage
            .open(USER_ROLES.ADMIN)
            .urlShouldBe("")
            .goToPage("Route")
            .urlShouldBe("event/route")
            .goToPage("Rules")
            .urlShouldBe("event/rules")
            .goToPage("Results")
            .urlShouldBe("event/results")
            .goToPage("Organisers")
            .urlShouldBe("organiser")
            .goToPage("Admin")
            .urlShouldBe("admin")
            .goToPage("Profile")
            .urlShouldBe("user/profile")
            .goToPage("Account")
            .urlShouldBe("user/account")
            .goToPage("Current Event")
            .urlShouldBe("event/current")
            .goToPage("Promotion")
            .urlShouldBe("event/promotion")
            .goToPage("Home")
            .urlShouldBe("")
            .open()
            .goToPage("Sign In")
            .urlShouldBe("auth/sign-in");
        });

        it("Should not be able to see links to restricted pages", () => {
          homePage
            .open()
            .verifyRestrictedLinksVisibility({ userProfile: false, organiser: false, admin: false })
            .open(USER_ROLES.USER)
            .verifyRestrictedLinksVisibility({ userProfile: true, organiser: false, admin: false })
            .open(USER_ROLES.ORGANISER)
            .verifyRestrictedLinksVisibility({ userProfile: true, organiser: true, admin: false })
            .open(USER_ROLES.ADMIN)
            .verifyRestrictedLinksVisibility({ userProfile: true, organiser: true, admin: true });
        });

        it("Should be able to sign out", () => {
          cy.stubUser(USER_ROLES.USER);

          homePage
            .open(USER_ROLES.USER)
            .goToPage("Account")
            .goToPage("SignOut")
            .urlShouldBe("")
            .verifyRestrictedLinksVisibility({ userProfile: false, organiser: false, admin: false });
        });
      },
    );
  }
});
