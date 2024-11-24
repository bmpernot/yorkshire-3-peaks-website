import addUserFunction from "../../services/users/addUser.mjs";

const addUser = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: `addUser only accepts POST method, you tried: ${event.httpMethod}`,
    };
  }

  const userObject = JSON.parse(event.body);
  const claims = event.requestContext.authorizer.claims;
  const userId = claims.sub;
  const userRole = claims["cognito:groups"];

  try {
    if (userId === userObject.id || userRole.includes("Admin")) {
      const data = await addUserFunction({ userObject });

      console.info(`Successfully added user: ${data}`);
      return {
        statusCode: 201,
      };
    } else {
      return {
        statusCode: 403,
        body: "Unauthorized add this user info.",
      };
    }
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: `Failed to add user: ${userObject}`,
    };
  }
};

export default addUser;
