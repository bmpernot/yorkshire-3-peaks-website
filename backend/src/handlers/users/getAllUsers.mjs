import getAllUsersFunction from "../../services/users/getAllUsers.mjs";

const getAllUsers = async (event) => {
  if (event.httpMethod !== "GET") {
    const response = {
      statusCode: 405,
      body: new Error(`getAllUsers only accepts GET method, you tried: ${event.httpMethod}`),
    };

    return response;
  }

  console.info("Received: ", event);

  // TODO - make sure that the user not trying to add additional fields to get unless they are an admin - don't want to give away everyone's data unless we are generating the cards

  try {
    const data = await getAllUsersFunction();
    const users = data.Items;

    console.info(`Response from: ${event.path}, ${users}`);

    const response = {
      statusCode: 200,
      body: users,
    };

    return response;
  } catch (error) {
    console.error("Error: ", error);

    const response = {
      statusCode: 500,
      body: new Error("An error occurred when tring to get all users", {
        cause: error,
      }),
    };

    return response;
  }
};

export default getAllUsers;
