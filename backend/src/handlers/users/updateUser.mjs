import updateUserFunction from "../../services/users/updateUser.mjs";

const updateUser = async (event) => {
  if (event.httpMethod !== "PATCH") {
    return {
      statusCode: 405,
      body: `updateUser only accepts PUT method, you tried: ${event.httpMethod}`,
    };
  }

  const newUserData = JSON.parse(event.body);
  const idToUpdate = event.pathParameters.id;
  const claims = event.requestContext.authorizer.claims;
  const userId = claims.sub;
  const userRole = claims["cognito:groups"];

  try {
    if (userId === idToUpdate || userRole.includes("Admin")) {
      const data = await updateUserFunction({ newUserData, id: idToUpdate });
      const updatedAttributes = data.Attributes;

      console.info(`Successfully updated user: ${idToUpdate}`);

      return {
        statusCode: 200,
        body: updatedAttributes,
      };
    } else {
      return {
        statusCode: 403,
        body: "Unauthorized to update this user.",
      };
    }
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: `Failed to update user: ${idToUpdate}`,
    };
  }
};

export default updateUser;
