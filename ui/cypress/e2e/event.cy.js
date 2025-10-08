import eventPageClass from "../pages/event.page";
import resultsPageClass from "../pages/results.page";
import {
  stubEvents,
  stubEventInformation,
  stubVolunteerRegistration,
  stubTeamRegistration,
  stubUserSearch,
} from "../support/stubs";
import { USER_ROLES } from "../../src/lib/constants.mjs";
import authPageClass from "../pages/auth.page";

describe("Event", () => {
  const eventPage = new eventPageClass();
  const authPage = new authPageClass();
  let events, eventInformation;
  beforeEach(() => {
    events = stubEvents({ numberOfEvents: 2 });
    eventInformation = stubEventInformation({ events });
  });

  describe("Event Selection", () => {
    const resultsPage = new resultsPageClass();

    it("Should automatically show the event with the closest date", () => {
      events = stubEvents({ numberOfEvents: 5 });
      eventInformation = stubEventInformation({ events });

      eventPage.open().waitFor(["@Events", `@Event-Information-${events[1].eventId}`]);

      resultsPage.verifySelectedEvent(events[1]);
    });

    it("Should allow users to select the event they want to attend", () => {
      events = stubEvents({ numberOfEvents: 3 });
      eventInformation = stubEventInformation({ events });

      eventPage
        .open()
        .waitFor(["@Events", `@Event-Information-${events[1].eventId}`])
        .verifyEventSummary(eventInformation[events[1].eventId]);

      resultsPage.selectEvent(events[2].eventId);

      eventPage
        .waitFor([`@Event-Information-${events[2].eventId}`])
        .verifyEventSummary(eventInformation[events[2].eventId]);
    });

    it("Should show no events when there are none", () => {
      events = stubEvents({ numberOfEvents: 0 });

      eventPage.open().waitFor(["@Events"]).verifyNoEventsAvailable();
    });

    it("Should only show events in the future", () => {
      eventPage.open().waitFor(["@Events"]);

      resultsPage.verifySelectedEvent(events[1]).verifyEvents([events[1]]);
    });
  });

  describe("Event Summary", () => {
    it("Should show all pieces of information about the event", () => {
      eventPage
        .open()
        .waitFor(["@Events", `@Event-Information-${events[1].eventId}`])
        .verifyEventSummary(eventInformation[events[1].eventId]);
    });
  });

  describe("Event Team Registration", () => {
    it("Should show all pieces of information", () => {
      eventPage.open().verifyEventTeamRegistration();
    });

    it("Should allow users to search for other users via name", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);
      stubUserSearch(events[1].eventId, [
        {
          searchTerm: "Benjamin",
          response: [
            {
              email: "yorkshirepeaks@gmail.com",
              family_name: "Pernot",
              given_name: "Benjamin",
              sub: "12345678-1234-1234-1234-123456789000",
              alreadyParticipating: false,
            },
          ],
        },
      ]);

      eventPage
        .open()
        .searchForUser({ teamMemberNumber: 0, searchValue: "Benjamin" })
        .verifyUserSearch({ teamMemberNumber: 0, option: 0, value: "Benjamin Pernot (yorkshirepeaks@gmail.com)" });
    });

    it("Should allow users to search for other users via email", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);
      stubUserSearch(events[1].eventId, [
        {
          searchTerm: "yorkshirepeaks@gmail.com",
          response: [
            {
              email: "yorkshirepeaks@gmail.com",
              family_name: "Pernot",
              given_name: "Benjamin",
              sub: "12345678-1234-1234-1234-123456789000",
              alreadyParticipating: false,
            },
          ],
        },
      ]);

      eventPage
        .open()
        .searchForUser({ teamMemberNumber: 0, searchValue: "yorkshirepeaks@gmail.com" })
        .verifyUserSearch({ teamMemberNumber: 0, option: 0, value: "Benjamin Pernot (yorkshirepeaks@gmail.com)" });
    });

    it("Should allow a team (up to 5) to sign up to the event and be brought to their account page where they can see their entry", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);

      const CUSTOM_API_RESPONSE_MESSAGE =
        "a custom message from the api to prove that we display the response to the ui";
      stubTeamRegistration({ events, overrides: { [events[1].eventId]: CUSTOM_API_RESPONSE_MESSAGE } });

      stubUserSearch(events[1].eventId, [
        {
          searchTerm: "Benjamin-1",
          response: [
            {
              email: "yorkshirepeaks-1@gmail.com",
              family_name: "Pernot-1",
              given_name: "Benjamin-1",
              sub: "76420294-00e1-700b-74d6-a22a780eeae1",
              alreadyParticipating: false,
            },
          ],
        },
        {
          searchTerm: "Benjamin-2",
          response: [
            {
              email: "yorkshirepeaks-2@gmail.com",
              family_name: "Pernot-2",
              given_name: "Benjamin-2",
              sub: "12345678-1234-1234-1234-123456789001",
              alreadyParticipating: false,
            },
          ],
        },
        {
          searchTerm: "Benjamin-3",
          response: [
            {
              email: "yorkshirepeaks-3@gmail.com",
              family_name: "Pernot-3",
              given_name: "Benjamin-3",
              sub: "12345678-1234-1234-1234-123456789002",
              alreadyParticipating: false,
            },
          ],
        },
        {
          searchTerm: "Benjamin-4",
          response: [
            {
              email: "yorkshirepeaks-4@gmail.com",
              family_name: "Pernot-4",
              given_name: "Benjamin-4",
              sub: "12345678-1234-1234-1234-123456789003",
              alreadyParticipating: false,
            },
          ],
        },
        {
          searchTerm: "Benjamin-5",
          response: [
            {
              email: "yorkshirepeaks-5@gmail.com",
              family_name: "Pernot-5",
              given_name: "Benjamin-5",
              sub: "12345678-1234-1234-1234-123456789004",
              alreadyParticipating: false,
            },
          ],
        },
      ]);

      eventPage
        .open()
        .typeTeamName("Y3P")
        .searchForUser({ teamMemberNumber: 0, searchValue: "Benjamin-1" })
        .selectUser({ teamMemberNumber: 0, option: 0 })
        .happyToVolunteer({ teamMemberNumber: 0 })
        .additionalRequirements({ teamMemberNumber: 0, additionalRequirementsText: "a" })
        .searchForUser({ teamMemberNumber: 1, searchValue: "Benjamin-2" })
        .selectUser({ teamMemberNumber: 1, option: 0 })
        .happyToVolunteer({ teamMemberNumber: 1 })
        .additionalRequirements({ teamMemberNumber: 1, additionalRequirementsText: "b" })
        .searchForUser({ teamMemberNumber: 2, searchValue: "Benjamin-3" })
        .selectUser({ teamMemberNumber: 2, option: 0 })
        .happyToVolunteer({ teamMemberNumber: 2 })
        .additionalRequirements({ teamMemberNumber: 2, additionalRequirementsText: "c" })
        .searchForUser({ teamMemberNumber: 3, searchValue: "Benjamin-4" })
        .selectUser({ teamMemberNumber: 3, option: 0 })
        .happyToVolunteer({ teamMemberNumber: 3 })
        .additionalRequirements({ teamMemberNumber: 3, additionalRequirementsText: "d" })
        .searchForUser({ teamMemberNumber: 4, searchValue: "Benjamin-5" })
        .selectUser({ teamMemberNumber: 4, option: 0 })
        .happyToVolunteer({ teamMemberNumber: 4 })
        .additionalRequirements({ teamMemberNumber: 4, additionalRequirementsText: "e" })
        .submitTeam();

      authPage
        .waitForThen(`@Register-Event-${events[1].eventId}`, (interception) => {
          expect(interception.request.body.teamName).to.eq("Y3P");
          expect(interception.request.body.members).to.deep.equal([
            {
              email: "yorkshirepeaks-1@gmail.com",
              family_name: "Pernot-1",
              given_name: "Benjamin-1",
              sub: "76420294-00e1-700b-74d6-a22a780eeae1",
              additionalRequirements: "a",
              isVolunteer: true,
            },
            {
              email: "yorkshirepeaks-2@gmail.com",
              family_name: "Pernot-2",
              given_name: "Benjamin-2",
              sub: "12345678-1234-1234-1234-123456789001",
              additionalRequirements: "b",
              isVolunteer: true,
            },
            {
              email: "yorkshirepeaks-3@gmail.com",
              family_name: "Pernot-3",
              given_name: "Benjamin-3",
              sub: "12345678-1234-1234-1234-123456789002",
              additionalRequirements: "c",
              isVolunteer: true,
            },
            {
              email: "yorkshirepeaks-4@gmail.com",
              family_name: "Pernot-4",
              given_name: "Benjamin-4",
              sub: "12345678-1234-1234-1234-123456789003",
              additionalRequirements: "d",
              isVolunteer: true,
            },
            {
              email: "yorkshirepeaks-5@gmail.com",
              family_name: "Pernot-5",
              given_name: "Benjamin-5",
              sub: "12345678-1234-1234-1234-123456789004",
              additionalRequirements: "e",
              isVolunteer: true,
            },
          ]);
        })
        .verifyToast(CUSTOM_API_RESPONSE_MESSAGE)
        .urlShouldBe("user/profile");
    });

    it("Should not allow a team of 2 to sign up to an event", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);
      stubUserSearch(events[1].eventId, [
        {
          searchTerm: "Benjamin-1",
          response: [
            {
              email: "yorkshirepeaks-1@gmail.com",
              family_name: "Pernot-1",
              given_name: "Benjamin-1",
              sub: "76420294-00e1-700b-74d6-a22a780eeae1",
              alreadyParticipating: false,
            },
          ],
        },
        {
          searchTerm: "Benjamin-2",
          response: [
            {
              email: "yorkshirepeaks-2@gmail.com",
              family_name: "Pernot-2",
              given_name: "Benjamin-2",
              sub: "12345678-1234-1234-1234-123456789001",
              alreadyParticipating: false,
            },
          ],
        },
      ]);

      eventPage
        .open()
        .typeTeamName("Y3P")
        .searchForUser({ teamMemberNumber: 0, searchValue: "Benjamin-1" })
        .selectUser({ teamMemberNumber: 0, option: 0 })
        .searchForUser({ teamMemberNumber: 1, searchValue: "Benjamin-2" })
        .selectUser({ teamMemberNumber: 1, option: 0 })
        .submitTeam()
        .verifyError({ errorIndex: 0, value: "Teams must have 3 to 5 members." });
    });

    it("Should not allow a team in which the members do not include themselves", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);
      stubUserSearch(events[1].eventId, [
        {
          searchTerm: "Benjamin-1",
          response: [
            {
              email: "yorkshirepeaks-1@gmail.com",
              family_name: "Pernot-1",
              given_name: "Benjamin-1",
              sub: "12345678-1234-1234-1234-123456789001",
              alreadyParticipating: false,
            },
          ],
        },
        {
          searchTerm: "Benjamin-2",
          response: [
            {
              email: "yorkshirepeaks-2@gmail.com",
              family_name: "Pernot-2",
              given_name: "Benjamin-2",
              sub: "12345678-1234-1234-1234-123456789002",
              alreadyParticipating: false,
            },
          ],
        },
        {
          searchTerm: "Benjamin-3",
          response: [
            {
              email: "yorkshirepeaks-3@gmail.com",
              family_name: "Pernot-3",
              given_name: "Benjamin-3",
              sub: "12345678-1234-1234-1234-123456789003",
              alreadyParticipating: false,
            },
          ],
        },
      ]);

      eventPage
        .open()
        .typeTeamName("Y3P")
        .searchForUser({ teamMemberNumber: 0, searchValue: "Benjamin-1" })
        .selectUser({ teamMemberNumber: 0, option: 0 })
        .searchForUser({ teamMemberNumber: 1, searchValue: "Benjamin-2" })
        .selectUser({ teamMemberNumber: 1, option: 0 })
        .searchForUser({ teamMemberNumber: 2, searchValue: "Benjamin-3" })
        .selectUser({ teamMemberNumber: 2, option: 0 })
        .submitTeam()
        .verifyError({ errorIndex: 0, value: "You are required to be part of the team." });
    });

    it("Should not allow a team to be submitted when there is no team name", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);
      stubUserSearch(events[1].eventId, [
        {
          searchTerm: "Benjamin-1",
          response: [
            {
              email: "yorkshirepeaks-1@gmail.com",
              family_name: "Pernot-1",
              given_name: "Benjamin-1",
              sub: "76420294-00e1-700b-74d6-a22a780eeae1",
              alreadyParticipating: false,
            },
          ],
        },
        {
          searchTerm: "Benjamin-2",
          response: [
            {
              email: "yorkshirepeaks-2@gmail.com",
              family_name: "Pernot-2",
              given_name: "Benjamin-2",
              sub: "12345678-1234-1234-1234-123456789002",
              alreadyParticipating: false,
            },
          ],
        },
        {
          searchTerm: "Benjamin-3",
          response: [
            {
              email: "yorkshirepeaks-3@gmail.com",
              family_name: "Pernot-3",
              given_name: "Benjamin-3",
              sub: "12345678-1234-1234-1234-123456789003",
              alreadyParticipating: false,
            },
          ],
        },
      ]);

      eventPage
        .open()
        .searchForUser({ teamMemberNumber: 0, searchValue: "Benjamin-1" })
        .selectUser({ teamMemberNumber: 0, option: 0 })
        .searchForUser({ teamMemberNumber: 1, searchValue: "Benjamin-2" })
        .selectUser({ teamMemberNumber: 1, option: 0 })
        .searchForUser({ teamMemberNumber: 2, searchValue: "Benjamin-3" })
        .selectUser({ teamMemberNumber: 2, option: 0 })
        .submitTeam()
        .verifyError({ errorIndex: 0, value: "Team name is required." });
    });

    it.only("Should not allow a team in which any of the members are already part of this team or another team", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);
      stubUserSearch(events[1].eventId, [
        {
          searchTerm: "Benjamin",
          response: [
            {
              email: "yorkshirepeaks-1@gmail.com",
              family_name: "Pernot-1",
              given_name: "Benjamin-1",
              sub: "12345678-1234-1234-1234-123456789001",
              alreadyParticipating: true,
            },
            {
              email: "yorkshirepeaks-2@gmail.com",
              family_name: "Pernot-2",
              given_name: "Benjamin-2",
              sub: "76420294-00e1-700b-74d6-a22a780eeae1",
              alreadyParticipating: false,
            },
          ],
        },
      ]);

      eventPage
        .open()
        .searchForUser({ teamMemberNumber: 0, searchValue: "Benjamin" })
        .verifyUserSearchDisabled({ teamMemberNumber: 0, option: 0 })
        .selectUser({ teamMemberNumber: 0, option: 1 })
        .searchForUser({ teamMemberNumber: 1, searchValue: "Benjamin" })
        .verifyUserSearchDisabled({ teamMemberNumber: 1, option: 1 });
    });

    it("Should not allow a user to register a team until they have signed in", () => {
      eventPage.open().verifyEventTeamRegistrationSignInButton();
    });
  });

  describe("Event Volunteer Registration", () => {
    it("Should show all pieces of information", () => {
      eventPage.open().verifyEventVolunteerRegistration();
    });

    it("Should not allow a user to register as a volunteer until they have signed in", () => {
      eventPage.open().verifyEventVolunteerRegistrationSignInButton();
    });

    it("Should allow a user to register as a volunteer for a particular event and be brought to their account page where they can see their entry", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);

      const CUSTOM_API_RESPONSE_MESSAGE =
        "a custom message from the api to prove that we display the response to the ui";
      const ADDITIONAL_REQUIREMENT = "I cant walk very far so could I have a job in the HQ";
      stubVolunteerRegistration({ events, overrides: { [events[1].eventId]: CUSTOM_API_RESPONSE_MESSAGE } });

      eventPage.open().registerAsVolunteerForEvent({ additionalRequirement: ADDITIONAL_REQUIREMENT });

      authPage
        .waitForThen(`@Volunteer-Event-${events[1].eventId}`, (interception) => {
          expect(interception.request.body).to.include({
            memberId: "76420294-00e1-700b-74d6-a22a780eeae1",
            additionalRequirements: ADDITIONAL_REQUIREMENT,
          });
        })
        .verifyToast(CUSTOM_API_RESPONSE_MESSAGE)
        .urlShouldBe("user/profile");
    });
  });
});
