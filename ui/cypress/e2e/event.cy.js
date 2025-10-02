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

    it.only("Should allow users to search for other users via name", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);
      stubUserSearch([
        {
          searchTerm: "Benjamin",
          response: {
            email: "yorkshirepeaks@gmail.com",
            family_name: "Pernot",
            given_name: "Benjamin",
            sub: "12345678-1234-1234-1234-123456789000",
          },
        },
      ]);

      eventPage
        .open()
        .searchForUser({ teamMemberNumber: 0, searchValue: "Benjamin" })
        .verifyUserSearch({ teamMemberNumber: 0, option: 0, value: "Benjamin Pernot (yorkshirepeaks@gmail.com)" });
    });

    it.skip("Should allow users to search for other users via email", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);
      stubUserSearch();

      eventPage.open().searchForUser("yorkshirepeaks@gmail.com");
    });

    it("Should allow a team (up to 5) to sign up to the event and be brought to their account page where they can see their entry", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);
      stubUserSearch();
      stubTeamRegistration();

      eventPage.open();
    });

    it("Should not allow a team of 2 to sign up to an event", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);
      stubUserSearch();

      eventPage.open();
    });

    it("Should not allow a team in which the members do not include themselves", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);
      stubUserSearch();

      eventPage.open();
    });

    it("Should not allow a team in which any of the members are already part of a team", () => {
      cy.interceptAmplifyAuth().stubUser(USER_ROLES.USER);
      stubUserSearch();

      eventPage.open();
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
