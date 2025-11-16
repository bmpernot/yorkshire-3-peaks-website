import searchUsersFunction from "../../services/users/searchUser.mjs";
import getUsersFunction from "../../services/users/getUsers.mjs";

// TODO - clean this up and it's functions to make it more generic

const getUsers = async (event) => {
  if (event.requestContext.http.method !== "GET") {
    return {
      statusCode: 405,
      body: `getUsers only accepts GET method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const queryParams = event.queryStringParameters || {};
  const claims = event.requestContext.authorizer.jwt.claims;
  const userRole = claims["cognito:groups"] ?? "User";

  try {
    if (queryParams.fields && !userRole.includes("Organiser") && !userRole.includes("Admin")) {
      return {
        statusCode: 403,
        body: "Unauthorized to get more fields",
      };
    } else {
      const { fields, ...searchFilters } = queryParams;
      const response = await searchUsersFunction(searchFilters);

      let users;
      if (!searchFilters.searchTerm) {
        users = await getUsersFunction(fields, response);
      } else if (fields) {
        users = await getUsersFunction(
          fields,
          response.map((user) => user.userId),
        );
      } else {
        users = response;
      }

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(users),
      };
    }
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to get users",
    };
  }
};

export default getUsers;
