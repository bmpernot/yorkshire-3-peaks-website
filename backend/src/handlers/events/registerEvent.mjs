import registerEventFunction from "../../services/events/registerEvent.mjs";

const registerEvent = async (event) => {
  if (event.requestContext.http.method !== "POST") {
    return {
      statusCode: 405,
      body: `registerEvent only accepts POST method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const claims = event.requestContext.authorizer.jwt.claims;
  const groups = claims["cognito:groups"] || [];

  if (!groups.includes("Admin") && !groups.includes("Organiser")) {
    return {
      statusCode: 403,
      body: "Only Admin or Organiser users can create events",
    };
  }

  const [invalidDataReasons, data] = validateRequest(event.body);

  if (invalidDataReasons.length !== 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ errors: invalidDataReasons }),
    };
  }

  try {
    const result = await registerEventFunction(data, claims.sub);

    console.log("Event created", {
      eventId: result.eventId,
      userId: claims.sub,
      timestamp: new Date().toISOString(),
    });

    return {
      statusCode: 201,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Failed to create event", {
      userId: claims.sub,
      timestamp: new Date().toISOString(),
      error: error.message,
    });

    return {
      statusCode: 500,
      body: "Failed to register event",
    };
  }
};

export default registerEvent;

function validateRequest(data) {
  let parsed;
  const invalidDataReasons = [];

  try {
    parsed = typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    invalidDataReasons.push("Invalid JSON in request body");
    return [invalidDataReasons, undefined];
  }

  const { startDate, endDate, requiredWalkers, requiredVolunteers, earlyBirdPrice, earlyBirdCutoff, price } =
    parsed || {};

  const dateFields = [
    { value: startDate, name: "startDate" },
    { value: endDate, name: "endDate" },
    { value: earlyBirdCutoff, name: "earlyBirdCutoff" },
  ];

  dateFields.forEach(({ value, name }) => {
    if (!value || isNaN(Date.parse(value))) {
      invalidDataReasons.push(`Valid ${name} is required`);
    }
  });

  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    invalidDataReasons.push("endDate must be after startDate");
  }

  const integerFields = [
    { value: requiredWalkers, name: "requiredWalkers", min: 1 },
    { value: requiredVolunteers, name: "requiredVolunteers", min: 0 },
    { value: earlyBirdPrice, name: "earlyBirdPrice", min: 1 },
    { value: price, name: "price", min: 1 },
  ];

  integerFields.forEach(({ value, name, min }) => {
    if (!Number.isInteger(value) || value < min) {
      const constraint = min === 0 ? "non-negative" : "positive";
      invalidDataReasons.push(`${name} must be a ${constraint} integer`);
    }
  });

  return [invalidDataReasons, parsed];
}
