import paymentSucceededFunction from "../../services/teams/paymentSucceeded.mjs";

const paymentSucceeded = async (event) => {
  if (event.requestContext.http.method !== "POST") {
    return {
      statusCode: 405,
      body: `paymentSucceeded only accepts POST method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const queryParams = event.queryStringParameters;
  const teamId = queryParams.teamId;

  try {
    await paymentSucceededFunction(teamId, JSON.parse(event.body));

    return {
      statusCode: 201,
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Failed to process successful payment - please contact yorkshirepeaks@gmail.com",
    };
  }
};

export default paymentSucceeded;
