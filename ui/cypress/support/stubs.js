import { generateEvents, generateEntries } from "./generators";

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

export { stubEvents, stubEntries };
