import getTeamsFunction from "../../services/teams/getTeams.mjs";
import getUserTeamsFunction from "../../services/users/getTeams.mjs";

const getTeams = async (event) => {
  if (event.requestContext.http.method !== "GET") {
    return {
      statusCode: 405,
      body: `getTeams only accepts GET method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const queryParams = event.queryStringParameters;
  const claims = event.requestContext.authorizer.jwt.claims;
  const userRole = claims["cognito:groups"] ?? "User";

  if (queryParams.teamIds && !userRole.includes("Organiser") && !userRole.includes("Admin")) {
    return {
      statusCode: 403,
      body: "Unauthorized to get specific teams",
    };
  }

  let teamIds = [];

  if (queryParams.teamIds) {
    teamIds = queryParams.teamIds.split(",");
  } else {
    teamIds = await getUserTeamsFunction(claims.sub);
  }

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
