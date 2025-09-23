import resultsPageClass from "../pages/results.page";
import { stubEvents, stubEntries } from "../support/stubs";
describe("Results", () => {
  const resultsPage = new resultsPageClass();
  let events, entries;
  beforeEach(() => {
    events = stubEvents({ numberOfEvents: 1 });
    entries = stubEntries({ events });
  });

  it.only("Should show all pieces of information in the table", () => {
    resultsPage.open().verifyEvents(events).verifyEntries(entries[events[0].eventId]);
  });

  it("Should an empty table when there is no results for an event", () => {
    resultsPage.open().verifyEntries([]);
  });

  it("Should be able to use the refresh button to get new events", () => {
    resultsPage.open().verifyEvents(events);

    events = stubEvents({ numberOfEvents: 1, overrides: { events } });

    resultsPage.refreshEvents().verifyEvents(events);
  });

  it("Should be able to use the refresh button to get new entries", () => {
    entries = stubEntries({ events, overrides: { entries: { [events[0].eventId]: [] } } });
    resultsPage.open().verifyEntries(entries);

    entries = stubEntries({ events });
    resultsPage.refreshEntries().verifyEntries(entries);
  });

  it("Should be able to handle errors", () => {
    resultsPage.open().verifyEventsError().verifyEvents().verifyEntriesError().refreshEntries().verifyEntries();
  });

  it("Should be able to allow sorting", () => {
    resultsPage.open().verifyEntries().sortEntries().verifyEntries();
  });
});
