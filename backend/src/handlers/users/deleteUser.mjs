import deleteUserFunction from "../../services/users/deleteUser.mjs";

const deleteUser = async (event) => {
  if (event.httpMethod !== "DELETE") {
    return {
      statusCode: 405,
      body: `deleteUser only accepts DELETE method, you tried: ${event.httpMethod}`,
    };
  }

  const idToDelete = event.pathParameters.id;
  const claims = event.requestContext.authorizer.claims;
  const userId = claims.sub;
  const userRole = claims["cognito:groups"];

  try {
    if (userId === idToDelete || userRole.includes("Admin")) {
      await deleteUserFunction({ id: idToDelete });

      console.info(`Successfully deleted user: ${idToDelete}`);

      return {
        statusCode: 204,
      };
    } else {
      return {
        statusCode: 403,
        body: "Unauthorized to delete this user.",
      };
    }
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: `Failed to delete user: ${idToDelete}`,
    };
  }
};

export default deleteUser;
