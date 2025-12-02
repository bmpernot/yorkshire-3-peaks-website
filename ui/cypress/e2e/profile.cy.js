import profilePageClass from "../pages/profile.page";
import { stubTeams } from "../support/stubs";
import { USER_ROLES } from "../../src/lib/constants.mjs";

describe("Profile", () => {
  const profilePage = new profilePageClass();
  let teams;
  beforeEach(() => {
    cy.interceptAmplifyAuth();
    cy.stubUser(USER_ROLES.USER);
    cy.stubAPI();
    teams = stubTeams({ numberOfTeams: 10 });
  });

  describe("Overview", () => {
    it("Should be able to show all teams the user is a part of", () => {
      profilePage.open().waitFor(["@getTeams"]).verifyTitle().verifyTeamCards(teams);
    });

    it("Should be able to show a you are not apart of any team info banner", () => {
      stubTeams({ numberOfTeams: 0 });

      profilePage.open().waitFor(["@getTeams"]).verifyNoTeams();
    });

    it("Should be able to handle errors when getting the teams", () => {
      stubTeams({ numberOfTeams: 0, overrides: { errors: { times: 3 } } });

      profilePage.open().waitFor(["@getTeams"]).verifyError(0, "Failed to get your teams");
    });
  });

  describe("Team Dialog", () => {
    describe("Updating a team", () => {
      it("Should be able to update the teams information", () => {
        profilePage.open().waitFor(["@getTeams"]);
      });

      it("Should not allow you to save the teams information in a incorrect state", () => {
        profilePage.open().waitFor(["@getTeams"]);
      });

      it("Should not allow you to update the teams information once the event has started", () => {
        profilePage.open().waitFor(["@getTeams"]);
      });

      it.only("Should be able to handle errors when updating the team", () => {
        teams = stubTeams({ numberOfTeams: 1 });
        profilePage.open().waitFor(["@getTeams"]).openTeam(0);
      });
    });

    describe("Payment system", () => {
      it("Should be able to take payment from one of the team members", () => {
        profilePage.open().waitFor(["@getTeams"]);
      });

      it("Should be able to handle errors when trying to pay for a team", () => {
        profilePage.open().waitFor(["@getTeams"]);
      });
    });
  });
});
