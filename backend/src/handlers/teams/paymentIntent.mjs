import createPaymentIntentFunction from "../../services/teams/createPaymentIntent.mjs";

const paymentIntent = async (event) => {
  if (event.requestContext.http.method !== "POST") {
    return {
      statusCode: 405,
      body: `paymentIntent only accepts POST method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const queryParams = event.queryStringParameters || {};
  const { teamId, eventId, userId } = queryParams;

  if (!teamId || !eventId || !userId) {
    return {
      statusCode: 400,
      body: "teamId, eventId and userId are required",
    };
  }

  const body = JSON.parse(event.body);

  try {
    const response = await createPaymentIntentFunction(teamId, eventId, userId, body.amount);

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to create payment intent",
    };
  }
};

export default paymentIntent;
