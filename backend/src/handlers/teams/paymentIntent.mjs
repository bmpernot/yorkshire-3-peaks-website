import paymentIntentFunction from "../../services/teams/paymentIntent.mjs";

const paymentIntent = async (event) => {
  if (event.requestContext.http.method !== "POST") {
    return {
      statusCode: 405,
      body: `paymentIntent only accepts POST method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const queryParams = event.queryStringParameters;
  const teamId = queryParams.teamId;

  try {
    await paymentIntentFunction(teamId, JSON.parse(event.body));

    return {
      statusCode: 201,
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
