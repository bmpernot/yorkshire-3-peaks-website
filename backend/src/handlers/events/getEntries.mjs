import getEntriesFunction from "../../services/events/getEntries.mjs";

const getEntries = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: `getEntries only accepts GET method, you tried: ${event.httpMethod}`,
    };
  }

  try {
    const entries = await getEntriesFunction();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entries),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to get entries",
    };
  }
};

export default getEntries;
