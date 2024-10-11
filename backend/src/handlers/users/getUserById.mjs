import getUserByIdFunction from "../../services/users/getUserById.mjs";

const getUserById = async (event) => {
  if (event.httpMethod !== "GET") {
    const response = {
      statusCode: 405,
      body: new Error(`getUserById only accepts GET method, you tried: ${event.httpMethod}`),
    };

    return response;
  }

  console.info("Received: ", event);

  const id = event.pathParameters.id;

  try {
    const data = await getUserByIdFunction({ id });
    const item = data.Item;

    console.info(`Response from: ${event.path}, ${item}`);

    const response = {
      statusCode: 200,
      body: item,
    };

    return response;
  } catch (error) {
    console.error("Error: ", error);

    const response = {
      statusCode: 500,
      body: new Error(`An error occurred when tring to get the user with the id of: ${id}`, { cause: error }),
    };

    return response;
  }
};

export default getUserById;
