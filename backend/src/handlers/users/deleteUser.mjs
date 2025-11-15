import deleteUserFunction from "../../services/users/deleteUser.mjs";

const deleteUser = async (event) => {
  if (event.requestContext.http.method !== "DELETE") {
    return {
      statusCode: 405,
      body: `deleteUser only accepts DELETE method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const queryParams = event.queryStringParameters || {};
  const claims = event.requestContext.authorizer.jwt.claims;
  const userRole = claims["cognito:groups"] ?? "User";
  const authenticatedUserId = claims.sub;

  try {
    const { userId } = queryParams;
    if (userId !== authenticatedUserId && !userRole.includes("Admin")) {
      return {
        statusCode: 403,
        body: "Unauthorized to delete another user",
      };
    } else {
      const response = await deleteUserFunction({ userId });

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
      body: "Failed to delete users",
    };
  }
};

export default deleteUser;
