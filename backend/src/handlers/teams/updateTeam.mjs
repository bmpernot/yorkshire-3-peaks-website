import updateTeamFunction from "../../services/teams/updateTeam.mjs";
import getUserTeamsFunction from "../../services/users/getTeams.mjs";

const updateTeams = async (event) => {
  if (event.requestContext.http.method !== "PATCH") {
    return {
      statusCode: 405,
      body: `updateTeams only accepts PATCH method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const queryParams = event.queryStringParameters;
  const claims = event.requestContext.authorizer.jwt.claims;
  const userRole = claims["cognito:groups"] ?? "User";
  const teamId = queryParams.teamId;

  try {
    const userTeamIds = await getUserTeamsFunction(claims.sub);

    if (!userTeamIds.includes(teamId) && !userRole.includes("Organiser") && !userRole.includes("Admin")) {
      return {
        statusCode: 403,
        body: "Unauthorized to update teams your are not apart of",
      };
    }

    const team = await updateTeamFunction(teamId, JSON.parse(event.body));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to update teams",
    };
  }
};

export default updateTeams;
