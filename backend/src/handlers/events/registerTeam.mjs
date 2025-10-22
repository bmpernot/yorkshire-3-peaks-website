import registerTeamFunction from "../../services/teams/registerTeam.mjs";

const registerTeam = async (event) => {
  if (event.requestContext.http.method !== "POST") {
    return {
      statusCode: 405,
      body: `registerTeam only accepts POST method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const claims = event.requestContext.authorizer.jwt.claims;
  const authenticatedUserId = claims.sub;
  const eventId = event.queryStringParameters.eventId;

  const [invalidDataReasons, data] = validateRequest(authenticatedUserId, eventId, event.body);

  if (invalidDataReasons.length !== 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ errors: invalidDataReasons }),
    };
  }

  try {
    await registerTeamFunction(eventId, data);

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

function validateRequest(userId, eventId, data) {
  let parsed;
  const invalidDataReasons = [];

  if (!eventId) {
    invalidDataReasons.push(`registerTeam requires an eventId`);
  }

  try {
    parsed = typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    invalidDataReasons.push("Invalid JSON in request body");
    return [invalidDataReasons, undefined];
  }

  const { teamName, members } = parsed;

  // --- Validate team name ---
  if (!teamName || typeof teamName !== "string" || teamName.trim().length === 0) {
    invalidDataReasons.push("Team name is required");
  }

  // --- Validate members ---
  if (!Array.isArray(members)) {
    invalidDataReasons.push("Members must be an array");
  } else {
    if (members.length < 3 || members.length > 5) {
      invalidDataReasons.push("Team must have between 3 and 5 members");
    }

    // Ensure the submitting user is part of the team
    const submittingUserInTeam = members.some((m) => m.userId === userId);
    if (!submittingUserInTeam) {
      invalidDataReasons.push("The user submitting the request must be part of the team");
    }

    // Check for duplicate userIds
    const userIds = members.map((m) => m.userId);
    const duplicateIds = userIds.filter((id, idx) => userIds.indexOf(id) !== idx);
    if (duplicateIds.length > 0) {
      invalidDataReasons.push("Duplicate members are not allowed in a team");
    }

    // TODO - check that all members are not apart of any other team
  }

  return [invalidDataReasons, parsed];
}
