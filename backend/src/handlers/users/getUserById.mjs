import getUserByIdFunction from "../../services/users/getUserById.mjs";

const getUserById = async (event) => {
  if (event.httpMethod !== "GET") {
    const response = {
      statusCode: 405,
      body: new Error(`getUserById only accepts GET method, you tried: ${event.httpMethod}`),
    };

    return response;
  }

  const idToGet = event.pathParameters.id;
  const claims = event.requestContext.authorizer.claims;
  const userId = claims.sub;
  const userRole = claims["cognito:groups"];

  try {
    if (userId === idToGet || userRole.includes("Admin")) {
      const user = await getUserByIdFunction({ id: idToGet });

      return {
        statusCode: 200,
        body: JSON.stringify(user),
      };
    } else {
      return {
        statusCode: 403,
        body: "Unauthorized to get this user.",
      };
    }
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: `Failed to get user: ${idToGet}`,
    };
  }
};

export default getUserById;
