import updateTeamFunction from "../../services/teams/updateTeam.mjs";
import getUserTeamsFunction from "../../services/users/getTeams.mjs";

const updateTeam = async (event) => {
  if (event.requestContext.http.method !== "PATCH") {
    return {
      statusCode: 405,
      body: `updateTeam only accepts PATCH method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const queryParams = event.queryStringParameters;
  const claims = event.requestContext.authorizer.jwt.claims;
  const userRole = claims["cognito:groups"] ?? "User";
  const { teamId, eventId } = queryParams;

  try {
    const userTeams = await getUserTeamsFunction(claims.sub);
    const userTeamIds = userTeams.map((userTeam) => userTeam.teamId);

    if (!userTeamIds.includes(teamId) && !userRole.includes("Organiser") && !userRole.includes("Admin")) {
      return {
        statusCode: 403,
        body: "Unauthorized to update teams your are not apart of",
      };
    }

    const team = await updateTeamFunction(teamId, eventId, JSON.parse(event.body).actions);

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

export default updateTeam;
