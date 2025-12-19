import updateTeamFunction from "../../services/teams/updateTeam.mjs";
import getUserTeamsFunction from "../../services/users/getTeams.mjs";

const updateTeam = async (event) => {
  if (event.requestContext.http.method !== "PATCH") {
    return {
      statusCode: 405,
      body: `updateTeam only accepts PATCH method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const queryParams = event.queryStringParameters || {};
  const claims = event.requestContext.authorizer.jwt.claims;
  const userRole = claims["cognito:groups"] ?? "User";
  const { teamId, eventId } = queryParams;

  if (!teamId || !eventId) {
    return {
      statusCode: 400,
      body: "teamId and eventId are required",
    };
  }

  let actions;
  try {
    const body = JSON.parse(event.body);
    actions = body.actions;
  } catch {
    return {
      statusCode: 400,
      body: "Invalid JSON in request body",
    };
  }

  try {
    const userTeams = await getUserTeamsFunction(claims.sub);
    const userTeamIds = userTeams.map((userTeam) => userTeam.teamId);

    if (!userTeamIds.includes(teamId) && !userRole.includes("Organiser") && !userRole.includes("Admin")) {
      return {
        statusCode: 403,
        body: "Unauthorized to update teams you are not a part of",
      };
    }

    const response = await updateTeamFunction(teamId, eventId, actions);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
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
