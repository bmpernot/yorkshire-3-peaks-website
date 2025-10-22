import registerVolunteerFunction from "../../services/teams/registerVolunteer.mjs";

const registerVolunteer = async (event) => {
  if (event.requestContext.http.method !== "POST") {
    return {
      statusCode: 405,
      body: `registerVolunteer only accepts POST method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const claims = event.requestContext.authorizer.jwt.claims;
  const authenticatedUserId = claims.sub;
  const eventId = event.queryStringParameters.eventId;

  if (!eventId) {
    return {
      statusCode: 400,
      body: `registerVolunteer requires a filter of eventId`,
    };
  }

  try {
    await registerVolunteerFunction(eventId, authenticatedUserId, event.body);

    return {
      statusCode: 201,
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to register volunteer",
    };
  }
};

export default registerVolunteer;
