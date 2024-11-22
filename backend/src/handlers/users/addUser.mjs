import addUserFunction from "../../services/users/addUser.mjs";

const addUser = async (event) => {
  if (event.httpMethod !== "POST") {
    const response = {
      statusCode: 405,
      body: new Error(`addUser only accepts POST method, you tried: ${event.httpMethod}`),
    };

    return response;
  }

  // TODO - make sure that the user is adding themselves or it is an admin

  console.info("Received: ", event);

  const userObject = JSON.parse(event.body);

  try {
    const data = await addUserFunction({ userObject });

    console.info(`Response from: ${event.path}, Success - user added, ${data}`);
    const response = {
      statusCode: 201,
    };

    return response;
  } catch (error) {
    console.error("Error: ", error);

    const response = {
      statusCode: 500,
      body: new Error(`An error occurred when tring to add a user`, { cause: error }),
    };

    return response;
  }
};

export default addUser;
