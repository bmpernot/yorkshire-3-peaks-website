import resultsPageClass from "../pages/results.page";
import { stubEvents, stubEntries } from "../support/stubs";
describe("Results", () => {
  const resultsPage = new resultsPageClass();
  let events, entries;
  beforeEach(() => {
    events = stubEvents({ numberOfEvents: 1 });
    entries = stubEntries({ events });
  });

  it("Should show all pieces of information in the table", () => {
    resultsPage
      .open()
      .waitFor(["@Events", `@Event-Entry-${events[0].eventId}`])
      .verifySelectedEvent(events[0])
      .verifyEvents(events)
      .verifyEntries(entries[events[0].eventId]);
  });

  it("Should an empty table when there is no results for an event", () => {
    entries = stubEntries({ events, overrides: { entries: { [events[0].eventId]: [] } } });

    resultsPage
      .open()
      .waitFor(["@Events", `@Event-Entry-${events[0].eventId}`])
      .verifyEntries([]);
  });

  it("Should be able to use the refresh button to get new events", () => {
    const stubbedEvents = [
      {
        endDate: "2024-11-11T18:05:32.419Z",
        eventId: "05fcca38-426d-46c7-a560-a6c0ac095f45",
        startDate: "2024-11-09T18:05:32.419Z",
      },
      {
        endDate: "2024-11-11T18:05:32.432Z",
        eventId: "05fcca38-426d-46c7-a560-a6c0ac095f46",
        startDate: "2024-11-09T18:05:32.432Z",
      },
    ];

    events = stubEvents({
      numberOfEvents: 0,
      overrides: {
        events: [stubbedEvents[1]],
      },
    });

    entries = stubEntries({ events, overrides: { entries: { [events[0].eventId]: [] } } });

    resultsPage
      .open()
      .waitFor(["@Events", `@Event-Entry-${events[0].eventId}`])
      .verifyEvents(events);

    events = stubEvents({ numberOfEvents: 0, overrides: { events: stubbedEvents } });

    resultsPage.refreshEvents().waitFor(["@Events"]).verifyEvents(events);
  });

  it("Should be able to use the refresh button to get new entries", () => {
    entries = stubEntries({ events, overrides: { entries: { [events[0].eventId]: [] } } });
    resultsPage
      .open()
      .waitFor(["@Events", `@Event-Entry-${events[0].eventId}`])
      .then(() => {
        resultsPage.verifyEntries(entries[events[0].eventId]);
      })
      .then(() => {
        entries = stubEntries({ events });
        resultsPage.refreshEntries().waitFor([`@Event-Entry-${events[0].eventId}`]);
      })
      .then(() => {
        resultsPage.verifyEntries(entries[events[0].eventId]);
      });
  });

  it("Should be able to swap between events to get the result and cache the older ones", () => {
    events = stubEvents({
      numberOfEvents: 1,
      overrides: {
        events: [
          {
            startDate: new Date("01/01/2024").toISOString(),
            eventId: "0d72d55a-b4bd-4310-8027-e6488c90f7da",
            endDate: new Date("01/03/2024").toISOString(),
          },
        ],
      },
    });
    entries = stubEntries({ events });

    resultsPage
      .open()
      .waitFor(["@Events", `@Event-Entry-${events[0].eventId}`])
      .verifyRowsExist(entries[events[0].eventId])
      .selectEvent(events[1].eventId)
      .waitFor([`@Event-Entry-${events[1].eventId}`])
      .verifyRowsExist(entries[events[1].eventId])
      .selectEvent(events[0].eventId)
      .verifyRowsExist(entries[events[0].eventId]);
  });
});
