import homePageClass from "../pages/home.page";

describe("Footer", () => {
  const homePage = new homePageClass();
  describe(
    "Footer large page",
    {
      viewportWidth: Cypress.env("largeViewportWidth"),
      viewportHeight: Cypress.env("largeViewportHeight"),
    },
    () => {
      it("Should show all pieces of information in the footer", () => {
        homePage.open().verifyFooter();
      });
    },
  );

  describe(
    "Footer small page",
    {
      viewportWidth: Cypress.env("smallViewportWidth"),
      viewportHeight: Cypress.env("smallViewportHeight"),
    },
    () => {
      it("Should show all pieces of information in the footer", () => {
        homePage.open().verifyFooter();
      });
    },
  );
});
