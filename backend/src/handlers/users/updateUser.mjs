import updateUserFunction from "../../services/users/updateUser.mjs";

const updateUser = async (event) => {
  if (event.requestContext.http.method !== "PATCH") {
    return {
      statusCode: 405,
      body: `updateUser only accepts PATCH method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const body = event.body || {};
  const claims = event.requestContext.authorizer.jwt.claims;
  const userRole = claims["cognito:groups"] ?? "User";
  const authenticatedUserId = claims.sub;

  try {
    const { userId, firstName, lastName, email } = body;
    if (userId !== authenticatedUserId && !userRole.includes("Organiser") && !userRole.includes("Admin")) {
      return {
        statusCode: 403,
        body: "Unauthorized to update someone else profile",
      };
    } else {
      const response = await updateUserFunction({ userId, firstName, lastName, email });

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      };
    }
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to update users",
    };
  }
};

export default updateUser;
