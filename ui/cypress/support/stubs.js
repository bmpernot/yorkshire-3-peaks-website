import { generateEvents, generateEntries, generateEventInformation, generateTeams } from "./generators";

function stubEvents({ numberOfEvents, overrides = {} }) {
  const events = generateEvents({ numberOfEvents, overrides: overrides.events });

  const errorConfig = overrides?.error;
  let failCount = errorConfig?.times ?? 0;

  cy.intercept(`${Cypress.env("NEXT_PUBLIC_API_URL")}events`, (req) => {
    if (failCount > 0) {
      failCount--;
      req.reply({
        statusCode: errorConfig.statusCode ?? 500,
        body: { message: errorConfig.message ?? "Simulated network error" },
      });
    } else {
      req.reply(events);
    }
  }).as("Events");
  return events;
}

function stubEntries({ events, overrides = {} }) {
  const entries = generateEntries({ events, overrides });
  Object.keys(entries).forEach((key) => {
    const errorConfig = overrides.errors?.[key];
    let failCount = errorConfig?.times ?? 0;

    cy.intercept(`${Cypress.env("NEXT_PUBLIC_API_URL")}events/entries?eventId=${key}`, (req) => {
      if (failCount > 0) {
        failCount--;
        req.reply({
          statusCode: errorConfig.statusCode ?? 500,
          body: { message: errorConfig.message ?? "Simulated network error" },
        });
      } else {
        req.reply(entries[key]);
      }
    }).as(`Event-Entry-${key}`);
  });
  return entries;
}

function stubEventInformation({ events, overrides = {} }) {
  const eventsInformation = generateEventInformation({ events, overrides });
  Object.keys(eventsInformation).forEach((key) => {
    const errorConfig = overrides.errors?.[key];
    let failCount = errorConfig?.times ?? 0;

    cy.intercept(`${Cypress.env("NEXT_PUBLIC_API_URL")}events/information?eventId=${key}`, (req) => {
      if (failCount > 0) {
        failCount--;
        req.reply({
          statusCode: errorConfig.statusCode ?? 500,
          body: { message: errorConfig.message ?? "Simulated network error" },
        });
      } else {
        req.reply(eventsInformation[key]);
      }
    }).as(`Event-Information-${key}`);
  });
  return eventsInformation;
}

function stubVolunteerRegistration({ events, overrides = {} }) {
  events.forEach((event) => {
    cy.intercept(
      "POST",
      `${Cypress.env("NEXT_PUBLIC_API_URL")}events/volunteer?eventId=${event.eventId}`,
      overrides[event.eventId] || "Thank you for registering to volunteer.",
    ).as(`Volunteer-Event-${event.eventId}`);
  });
}

function stubTeamRegistration({ events, overrides = {} }) {
  events.forEach((event) => {
    cy.intercept(
      "POST",
      `${Cypress.env("NEXT_PUBLIC_API_URL")}events/register?eventId=${event.eventId}`,
      overrides[event.eventId] || "Thank you for registering a team.",
    ).as(`Register-Event-${event.eventId}`);
  });
}

function stubUserSearch(eventId, users = []) {
  users.forEach((user) => {
    cy.intercept(
      `${Cypress.env("NEXT_PUBLIC_API_URL")}users?searchTerm=${encodeURIComponent(user.searchTerm)}&eventId=${encodeURIComponent(eventId)}`,
      user.response,
    ).as(`User-Search`);
  });
}

function stubTeams({ numberOfTeams, overrides = {} }) {
  const teamsInformation = generateTeams({ numberOfTeams, overrides: overrides.teams });

  const errorConfig = overrides.errors;
  let failCount = errorConfig?.times ?? 0;

  cy.intercept("GET", `${Cypress.env("NEXT_PUBLIC_API_URL")}teams`, (req) => {
    if (failCount > 0) {
      failCount--;
      req.reply({
        statusCode: errorConfig.statusCode ?? 500,
        body: { message: errorConfig.message ?? "Simulated network error" },
      });
    } else {
      req.reply(teamsInformation);
    }
  }).as(`getTeams`);

  return teamsInformation;
}

function stubUpdateTeams({ numberOfTeams, overrides = {} }) {
  const teamsInformation = generateTeams({ numberOfTeams, overrides });

  const errorConfig = overrides.errors;
  let failCount = errorConfig?.times ?? 0;

  cy.intercept("PATCH", `${Cypress.env("NEXT_PUBLIC_API_URL")}teams`, (req) => {
    if (failCount > 0) {
      failCount--;
      req.reply({
        statusCode: errorConfig.statusCode ?? 500,
        body: { message: errorConfig.message ?? "Simulated network error" },
      });
    } else {
      req.reply(teamsInformation);
    }
  }).as(`updateTeams`);

  return teamsInformation;
}

function stubPaymentIntents({ teamId, eventId }) {
  cy.intercept("GET", `${Cypress.env("NEXT_PUBLIC_API_URL")}teams/paymentIntent?teamId=${teamId}&eventId=${eventId}`, {
    paymentIntentId: "1",
    clientSecret: "test_client_secret_1",
  }).as(`paymentIntent`);
}

export {
  stubEvents,
  stubEntries,
  stubEventInformation,
  stubVolunteerRegistration,
  stubTeamRegistration,
  stubUserSearch,
  stubTeams,
  stubUpdateTeams,
  stubPaymentIntents,
};
