import getTeamsFunction from "../../services/events/getTeams.mjs";

const getTeams = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: `getTeams only accepts GET method, you tried: ${event.httpMethod}`,
    };
  }

  try {
    const teams = await getTeamsFunction();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teams),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to get teams",
    };
  }
};

export default getTeams;
