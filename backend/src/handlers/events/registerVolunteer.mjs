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
  const queryParams = event.queryStringParameters || {};
  const { eventId } = queryParams;

  if (!eventId) {
    return {
      statusCode: 400,
      body: `registerVolunteer requires a filter of eventId`,
    };
  }

  try {
    let additionalRequirements = null;
    if (event.body) {
      const parsed = JSON.parse(event.body);
      additionalRequirements = parsed.additionalRequirements || null;
    }

    await registerVolunteerFunction(eventId, authenticatedUserId, additionalRequirements);

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
