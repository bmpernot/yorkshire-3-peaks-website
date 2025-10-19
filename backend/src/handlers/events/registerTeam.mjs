import registerTeamFunction from "../../services/teams/registerTeam.mjs";

const registerTeam = async (event) => {
  if (event.requestContext.http.method !== "POST") {
    return {
      statusCode: 405,
      body: `registerTeam only accepts POST method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const eventId = event.queryStringParameters.eventId;

  if (!eventId) {
    return {
      statusCode: 400,
      body: `registerTeam requires a filter of eventId`,
    };
  }

  // TODO - do error validation

  try {
    await registerTeamFunction();

    return {
      statusCode: 201,
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to register team",
    };
  }
};

export default registerTeam;
