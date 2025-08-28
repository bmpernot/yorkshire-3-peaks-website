import getEventsFunction from "../../services/events/getEvents.mjs";

const getEvents = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: `getUsers only accepts GET method, you tried: ${event.httpMethod}`,
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
