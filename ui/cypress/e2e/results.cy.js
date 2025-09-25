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
    resultsPage
      .open()
      .waitFor(["@Events", `@Event-Entry-${events[0].eventId}`])
      .verifyEvents(events);

    events = stubEvents({ numberOfEvents: 1, overrides: { events } });

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
});
