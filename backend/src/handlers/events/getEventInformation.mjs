import getEventInformationFunction from "../../services/events/getEventInformation.mjs";

const getEventInformation = async (event) => {
  if (event.requestContext.http.method !== "GET") {
    return {
      statusCode: 405,
      body: `getEventInformation only accepts GET method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const eventId = event.queryStringParameters.eventId;

  if (!eventId) {
    return {
      statusCode: 400,
      body: `getEventInformation requires a filter of eventId`,
    };
  }

  try {
    const events = await getEventInformationFunction(eventId);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(events),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: `Failed to get event information, eventId: ${eventId}`,
    };
  }
};

export default getEventInformation;
