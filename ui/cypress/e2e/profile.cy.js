import profilePageClass from "../pages/profile.page";
import { stubTeams, stubEvents, stubUserSearch, stubUpdateTeams, stubPaymentIntents } from "../support/stubs";
import { USER_ROLES } from "../../src/lib/constants.mjs";

describe("Profile", () => {
  const profilePage = new profilePageClass();
  let teams, events;
  beforeEach(() => {
    cy.interceptAmplifyAuth();
    cy.stubUser(USER_ROLES.USER);
    cy.stubAPI();

    teams = stubTeams({ numberOfTeams: 10 });
    events = stubEvents({ numberOfEvents: 1 });
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
        teams = stubTeams({
          numberOfTeams: 0,
          overrides: {
            teams: [
              {
                teamId: "0",
                teamName: `teamName-0`,
                members: [
                  {
                    userId: "0",
                    firstName: `first-name-0`,
                    lastName: `last-name-0`,
                    email: `email-0`,
                    searchValue: `first-name-0 last-name-0 email-0`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                  {
                    userId: "1",
                    firstName: `first-name-1`,
                    lastName: `last-name-1`,
                    email: `email-1`,
                    searchValue: `first-name-1 last-name-1 email-1`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                  {
                    userId: "2",
                    firstName: `first-name-2`,
                    lastName: `last-name-2`,
                    email: `email-2`,
                    searchValue: `first-name-2 last-name-2 email-2`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                ],
                volunteer: "false",
                cost: 120,
                paid: 80,
                eventId: events[0].eventId,
                startDate: new Date(`${new Date().getFullYear() + 1}/06/06 12:00`).toISOString(),
                endDate: new Date(`${new Date().getFullYear() + 1}/06/08 12:00`).toISOString(),
              },
            ],
          },
        });

        stubUserSearch(events[0].eventId, [
          {
            searchTerm: "Benjamin",
            response: [
              {
                email: "yorkshirepeaks@gmail.com",
                lastName: "Pernot",
                firstName: "Benjamin",
                userId: "12345678-1234-1234-1234-123456789003",
                alreadyParticipating: false,
              },
            ],
          },
        ]);

        profilePage
          .open()
          .waitFor(["@getTeams"])
          .openTeam(0)
          .modifyTeamName("new team name")
          .modifyMember({
            teamMemberIndex: 0,
            additionalRequirementsText: "additional requirements",
            willingToVolunteer: true,
          })
          .searchForUser({ teamMemberIndex: 3, searchValue: "Benjamin" })
          .selectUser({ teamMemberIndex: 3, option: 0 })
          .happyToVolunteer({ teamMemberIndex: 3 })
          .additionalRequirements({ teamMemberIndex: 3, additionalRequirementsText: "additional requirements" })
          .removeMember({ teamMemberIndex: 1 })
          .saveTeamChanges()
          .verifyToast("Team Updated")
          .waitForThen("@stubbedAPI", ({ request }) => {
            console.log("request", request);
            expect(request.body.actions).to.deep.equal([
              {
                action: "modify",
                type: "teamName",
                newValues: { teamName: "new team name" },
              },
              {
                action: "delete",
                type: "member",
                newValues: {
                  userId: "1",
                },
              },
              {
                action: "modify",
                type: "member",
                newValues: {
                  userId: "0",
                  additionalRequirements: "additional requirements",
                  willingToVolunteer: true,
                },
              },
              {
                action: "add",
                type: "member",
                newValues: {
                  userId: "12345678-1234-1234-1234-123456789003",
                  additionalRequirements: "additional requirements",
                  willingToVolunteer: true,
                },
              },
            ]);
          });
      });

      it("Should not allow you to save the teams information in a incorrect state", () => {
        teams = stubTeams({
          numberOfTeams: 0,
          overrides: {
            teams: [
              {
                teamId: "0",
                teamName: `teamName-0`,
                members: [
                  {
                    userId: "0",
                    firstName: `first-name-0`,
                    lastName: `last-name-0`,
                    email: `email-0`,
                    searchValue: `first-name-0 last-name-0 email-0`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                  {
                    userId: "1",
                    firstName: `first-name-1`,
                    lastName: `last-name-1`,
                    email: `email-1`,
                    searchValue: `first-name-1 last-name-1 email-1`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                  {
                    userId: "2",
                    firstName: `first-name-2`,
                    lastName: `last-name-2`,
                    email: `email-2`,
                    searchValue: `first-name-2 last-name-2 email-2`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                ],
                volunteer: "false",
                cost: 120,
                paid: 80,
                eventId: events[0].eventId,
                startDate: new Date(`${new Date().getFullYear() + 1}/06/06 12:00`).toISOString(),
                endDate: new Date(`${new Date().getFullYear() + 1}/06/08 12:00`).toISOString(),
              },
            ],
          },
        });

        profilePage
          .open()
          .waitFor(["@getTeams"])
          .openTeam(0)
          .removeMember({ teamMemberIndex: 0 })
          .modifyTeamName(" ")
          .saveTeamChanges()
          .verifyError(0, "Teams must have 3 to 5 members.")
          .verifyError(1, "Team name is required.");
      });

      it("Should not allow you to update the teams information once the event has started", () => {
        teams = stubTeams({
          numberOfTeams: 0,
          overrides: {
            teams: [
              {
                teamId: "0",
                teamName: `teamName-0`,
                members: [
                  {
                    userId: "0",
                    firstName: `first-name-0`,
                    lastName: `last-name-0`,
                    email: `email-0`,
                    searchValue: `first-name-0 last-name-0 email-0`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                  {
                    userId: "1",
                    firstName: `first-name-1`,
                    lastName: `last-name-1`,
                    email: `email-1`,
                    searchValue: `first-name-1 last-name-1 email-1`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                  {
                    userId: "2",
                    firstName: `first-name-2`,
                    lastName: `last-name-2`,
                    email: `email-2`,
                    searchValue: `first-name-2 last-name-2 email-2`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                ],
                volunteer: "false",
                cost: 120,
                paid: 80,
                eventId: events[0].eventId,
                startDate: new Date(`2024/06/06 12:00`).toISOString(),
                endDate: new Date(`2024/06/08 12:00`).toISOString(),
              },
            ],
          },
        });

        profilePage.open().waitFor(["@getTeams"]).openTeam(0).verifyTeamInformationIsDisabled();
      });

      it("Should allow a member to delete the team", () => {
        profilePage
          .open()
          .waitFor(["@getTeams"])
          .openTeam(0)
          .deleteTeam()
          .verifyConfirmDeleteTeam()
          .confirmDeleteTeam()
          .verifyToast("Team Deleted")
          .waitForThen("@stubbedAPI", ({ request }) => {
            console.log("request", request);
            expect(request.body.actions).to.deep.equal([
              {
                action: "delete",
                type: "entry",
              },
            ]);
          });
      });

      it("Should be able to handle errors when updating the team", () => {
        teams = stubTeams({ numberOfTeams: 1 });
        stubUpdateTeams({ numberOfTeams: 0, overrides: { errors: { times: 3 } } });

        profilePage
          .open()
          .waitFor(["@getTeams"])
          .openTeam(0)
          .modifyTeamName("test name")
          .saveTeamChanges()
          .verifyToast("Failed to update teams information")
          .verifyError(0, "Failed to update teams information");
      });
    });

    describe("Payment system", () => {
      it("Should be able to take payment from one of the team members", () => {
        teams = stubTeams({
          numberOfTeams: 0,
          overrides: {
            teams: [
              {
                teamId: "0",
                teamName: `teamName-0`,
                members: [
                  {
                    userId: "0",
                    firstName: `first-name-0`,
                    lastName: `last-name-0`,
                    email: `email-0`,
                    searchValue: `first-name-0 last-name-0 email-0`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                  {
                    userId: "1",
                    firstName: `first-name-1`,
                    lastName: `last-name-1`,
                    email: `email-1`,
                    searchValue: `first-name-1 last-name-1 email-1`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                  {
                    userId: "2",
                    firstName: `first-name-2`,
                    lastName: `last-name-2`,
                    email: `email-2`,
                    searchValue: `first-name-2 last-name-2 email-2`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                ],
                volunteer: "false",
                cost: 120,
                paid: 80,
                eventId: events[0].eventId,
                startDate: new Date(`${new Date().getFullYear() + 1}/06/06 12:00`).toISOString(),
                endDate: new Date(`${new Date().getFullYear() + 1}/06/08 12:00`).toISOString(),
              },
            ],
          },
        });

        stubPaymentIntents({ teamId: "0", eventId: events[0].eventId });

        profilePage
          .open()
          .waitFor(["@getTeams"])
          .openTeam(0)
          .pay(40)
          .urlShouldBe(`payment?clientSecret=test_client_secret_1`);
      });

      it("Should not be able to pay in a non-integer", () => {
        teams = stubTeams({
          numberOfTeams: 0,
          overrides: {
            teams: [
              {
                teamId: "0",
                teamName: `teamName-0`,
                members: [
                  {
                    userId: "0",
                    firstName: `first-name-0`,
                    lastName: `last-name-0`,
                    email: `email-0`,
                    searchValue: `first-name-0 last-name-0 email-0`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                  {
                    userId: "1",
                    firstName: `first-name-1`,
                    lastName: `last-name-1`,
                    email: `email-1`,
                    searchValue: `first-name-1 last-name-1 email-1`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                  {
                    userId: "2",
                    firstName: `first-name-2`,
                    lastName: `last-name-2`,
                    email: `email-2`,
                    searchValue: `first-name-2 last-name-2 email-2`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                ],
                volunteer: "false",
                cost: 120,
                paid: 80,
                eventId: events[0].eventId,
                startDate: new Date(`${new Date().getFullYear() + 1}/06/06 12:00`).toISOString(),
                endDate: new Date(`${new Date().getFullYear() + 1}/06/08 12:00`).toISOString(),
              },
            ],
          },
        });

        profilePage.open().waitFor(["@getTeams"]).openTeam(0).payAmount(38.2).verifyPayIsDisabled();
      });

      it("Should be able to handle errors when trying to pay for a team", () => {
        teams = stubTeams({
          numberOfTeams: 0,
          overrides: {
            teams: [
              {
                teamId: "0",
                teamName: `teamName-0`,
                members: [
                  {
                    userId: "0",
                    firstName: `first-name-0`,
                    lastName: `last-name-0`,
                    email: `email-0`,
                    searchValue: `first-name-0 last-name-0 email-0`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                  {
                    userId: "1",
                    firstName: `first-name-1`,
                    lastName: `last-name-1`,
                    email: `email-1`,
                    searchValue: `first-name-1 last-name-1 email-1`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                  {
                    userId: "2",
                    firstName: `first-name-2`,
                    lastName: `last-name-2`,
                    email: `email-2`,
                    searchValue: `first-name-2 last-name-2 email-2`,
                    additionalRequirements: null,
                    willingToVolunteer: false,
                  },
                ],
                volunteer: "false",
                cost: 120,
                paid: 80,
                eventId: events[0].eventId,
                startDate: new Date(`${new Date().getFullYear() + 1}/06/06 12:00`).toISOString(),
                endDate: new Date(`${new Date().getFullYear() + 1}/06/08 12:00`).toISOString(),
              },
            ],
          },
        });

        stubPaymentIntents({ teamId: "0", eventId: events[0].eventId, overrides: { errors: { times: 3 } } });

        profilePage
          .open()
          .waitFor(["@getTeams"])
          .openTeam(0)
          .pay(40)
          .verifyToast("Failed to initiate payment")
          .urlShouldBe("user/profile");
      });
    });
  });
});
