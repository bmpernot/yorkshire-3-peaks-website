import deleteUserFunction from "../../services/users/deleteUser.mjs";

const deleteUser = async (event) => {
  if (event.httpMethod !== "DELETE") {
    const response = {
      statusCode: 405,
      body: new Error(`deleteUser only accepts DELETE method, you tried: ${event.httpMethod}`),
    };

    return response;
  }

  console.info("Received: ", event);

  const id = event.pathParameters.id;

  try {
    await deleteUserFunction({ id });
    console.info(`Response from: ${event.path}, Success - user ${id} deleted`);

    const response = {
      statusCode: 204,
    };

    return response;
  } catch (error) {
    console.error("Error: ", error);

    const response = {
      statusCode: 500,
      body: new Error(`An error occurred when tring delete user with id: ${id}`, {
        cause: error,
      }),
    };

    return response;
  }
};

export default deleteUser;
