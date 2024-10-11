import updateUserFunction from "../../services/users/updateUser.mjs";

const updateUser = async (event) => {
  if (event.httpMethod !== "PUT") {
    const response = {
      statusCode: 405,
      body: new Error(`updateUser only accepts PUT method, you tried: ${event.httpMethod}`),
    };

    return response;
  }

  console.info("Received: ", event);

  const newUserData = JSON.parse(event.body);
  const id = event.pathParameters.id;

  try {
    const data = await updateUserFunction({ newUserData, id });
    const updatedAttributes = data.Attributes;

    console.info(`Response from: ${event.path}, Success - user updated, ${updatedAttributes}`);

    const response = {
      statusCode: 200,
      body: updatedAttributes,
    };

    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      body: new Error(`An error occurred when tring to update a user`, { cause: error }),
    };

    return response;
  }
};

export default updateUser;
