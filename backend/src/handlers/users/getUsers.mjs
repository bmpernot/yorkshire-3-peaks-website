import getUsersFunction from "../../services/users/getUsers.mjs";

const getUsers = async (event) => {
  if (event.requestContext.http.method !== "GET") {
    return {
      statusCode: 405,
      body: `getUsers only accepts GET method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const queryParams = event.queryStringParameters || {};
  const fields = queryParams.fields.length > 0 ? queryParams.fields.split(",") : undefined;
  const claims = event.requestContext.authorizer.jwt.claims;
  const userRole = claims["cognito:groups"] ?? "User";

  try {
    if (fields && !userRole.includes("Organiser") && !userRole.includes("Admin")) {
      return {
        statusCode: 403,
        body: "Unauthorized to get more fields",
      };
    } else {
      const users = await getUsersFunction(fields);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(users),
      };
    }
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to get users",
    };
  }
};

export default getUsers;
