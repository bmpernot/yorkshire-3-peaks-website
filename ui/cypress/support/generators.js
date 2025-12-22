import { v4 } from "uuid";

function generateRandomNumber({ min, max }) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
  if (overrides.entries) {
    return overrides.entries;
  }

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

  return entries;
}

function generateEventInformation({ events, overrides = {} }) {
  if (overrides.eventInformation) {
    return overrides.eventInformation;
  }

  const eventInformation = {};

  events.forEach((event) => {
    const requiredVolunteers = generateRandomNumber({ min: 6, max: 15 });
    const requiredWalkers = generateRandomNumber({ min: 160, max: 250 });
    const currentVolunteers = generateRandomNumber({ min: 0, max: requiredVolunteers });
    const currentWalkers = generateRandomNumber({ min: 0, max: requiredWalkers });
    eventInformation[event.eventId] = {
      requiredWalkers,
      currentWalkers,
      requiredVolunteers,
      currentVolunteers,
      moneyRaised: 40 * currentWalkers,
      startDate: event.startDate,
      endDate: event.endDate,
      eventId: event.eventId,
    };
  });

  return eventInformation;
}

function generateTeams({ numberOfTeams, overrides = [] }) {
  const teams = [];
  for (let index = 0; index < numberOfTeams; index++) {
    const numberOfMembers = generateRandomNumber({ min: 3, max: 5 });
    const numberOfMembersPaid = generateRandomNumber({ min: 3, max: 5 });

    const members = [];

    for (let index = 0; index < numberOfMembers; index++) {
      members.push({
        userId: index,
        firstName: `first-name-${index}`,
        lastName: `last-name-${index}`,
        email: `email-${index}`,
        searchValue: `first-name-${index} last-name-${index} email-${index}`,
        additionalRequirements: null,
        willingToVolunteer: false,
      });
    }

    const eventYear = new Date().getFullYear() + 1 + index;

    teams.push({
      teamId: index,
      teamName: `teamName-${index}`,
      members,
      volunteer: "false",
      cost: numberOfMembers * 40,
      paid: Math.min(numberOfMembers, numberOfMembersPaid) * 40,
      eventId: index,
      startDate: new Date(`${eventYear}/06/06 12:00`).toISOString(),
      endDate: new Date(`${eventYear}/06/08 12:00`).toISOString(),
    });
  }

  overrides.forEach((override) => teams.push(override));

  return teams;
}

export { generateEvents, generateEntries, generateRandomNumber, generateEventInformation, generateTeams };
