import getAllUsersFunction from "../../services/users/getAllUsers.mjs";

const getAllUsers = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: `getAllUsers only accepts GET method, you tried: ${event.httpMethod}`,
    };
  }

  const queryParams = event.queryStringParameters || {};
  const fields = queryParams.fields ? queryParams.fields.split(",") : null;
  const claims = event.requestContext.authorizer.claims;
  const userRole = claims["cognito:groups"];

  try {
    if (fields && !userRole.includes("Admin")) {
      return {
        statusCode: 403,
        body: "Unauthorized to get more fields",
      };
    } else {
      const users = await getAllUsersFunction(fields);

      return {
        statusCode: 200,
        body: JSON.stringify(users),
      };
    }
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to get all users",
    };
  }
};

export default getAllUsers;
