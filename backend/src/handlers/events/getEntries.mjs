import getEntriesFunction from "../../services/events/getEntries.mjs";

const getEntries = async (event) => {
  if (event.requestContext.http.method !== "GET") {
    return {
      statusCode: 405,
      body: `getEntries only accepts GET method, you tried: ${event.requestContext.http.method}`,
    };
  }

  if (!event.queryStringParameters.eventId) {
    return {
      statusCode: 400,
      body: `getEntries requires a filter of eventId`,
    };
  }

  try {
    const eventId = event.queryStringParameters.eventId;

    const entries = await getEntriesFunction(eventId);

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
