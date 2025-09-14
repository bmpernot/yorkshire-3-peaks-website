import getTeamsFunction from "../../services/teams/getTeams.mjs";

const getTeams = async (event) => {
  if (event.requestContext.http.method !== "GET") {
    return {
      statusCode: 405,
      body: `getTeams only accepts GET method, you tried: ${event.requestContext.http.method}`,
    };
  }

  if (!event.queryStringParameters.teamId) {
    return {
      statusCode: 400,
      body: `getTeams requires a filter of teamId`,
    };
  }

  const teamIds = event.queryStringParameters.teamId.split(",");

  try {
    const teams = await getTeamsFunction(teamIds);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teams),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to get teams",
    };
  }
};

export default getTeams;
