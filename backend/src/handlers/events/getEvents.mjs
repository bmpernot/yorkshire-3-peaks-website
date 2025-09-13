import getEventsFunction from "../../services/events/getEvents.mjs";

const getEvents = async (event) => {
  if (event.requestContext.http.method !== "GET") {
    return {
      statusCode: 405,
      body: `getEvents only accepts GET method, you tried: ${event.requestContext.http.method}`,
    };
  }

  try {
    const events = await getEventsFunction();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(events),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to get events",
    };
  }
};

export default getEvents;
