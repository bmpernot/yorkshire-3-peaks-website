import { v4 } from "uuid";

function generateEvents({ numberOfEvents, overrides = [] }) {
  const events = [];
  for (let i = 0; i < numberOfEvents; i++) {
    const startDate = Date.now() + i * 31557600000;
    const endDate = startDate + 172800000;
    events.push({
      startDate: new Date(startDate).toISOString(),
      eventId: v4(),
      endDate: new Date(endDate).toISOString(),
    });
  }
  return [...events, ...overrides];
}

function generateEntries({ events, overrides = {} }) {
  const entries = {};
  events.forEach((event) => {
    entries[event.eventId] = [];
    const numberOfEntries = overrides.numberOfEntries || generateRandomNumber({ min: 1, max: 5 });
    const cost = generateRandomNumber({ min: 140, max: 160 });
    for (let i = 0; i < numberOfEntries; i++) {
      const paid = numberOfEntries > 1 && Math.random() < 0.1 ? false : true;

      const start = new Date(event.startDate).valueOf() + 64800000 + i * 60000;
      const end = start + generateRandomNumber({ min: 25200000, max: 54000000 });
      const interval = (end - start) / 8;

      const entry = {
        eventId: event.eventId,
        cost: cost,
        paid: paid ? cost : 0,
        start: new Date(start).toISOString(),
        checkpoint1: new Date(start + interval).toISOString(),
        checkpoint2: new Date(start + interval * 2).toISOString(),
        checkpoint3: new Date(start + interval * 3).toISOString(),
        checkpoint4: new Date(start + interval * 4).toISOString(),
        checkpoint5: new Date(start + interval * 5).toISOString(),
        checkpoint6: new Date(start + interval * 6).toISOString(),
        checkpoint7: new Date(start + interval * 7).toISOString(),
        end: new Date(end).toISOString(),
        teamId: v4(),
        teamName: `team-${i + 1}`,
      };

      entries[event.eventId].push(entry);
    }
  });

  return overrides.entries || entries;
}

function generateRandomNumber({ min, max }) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { generateEvents, generateEntries, generateRandomNumber };
