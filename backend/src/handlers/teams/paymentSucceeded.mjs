import updateEntryWithPaidAmountFunction from "../../services/teams/updateEntryWithPaidAmount.mjs";

const paymentSucceeded = async (event) => {
  if (event.requestContext.http.method !== "POST") {
    return {
      statusCode: 405,
      body: `paymentSucceeded only accepts POST method, you tried: ${event.requestContext.http.method}`,
    };
  }

  const stripeSignature = event.headers["stripe-signature"];

  try {
    await updateEntryWithPaidAmountFunction(stripeSignature, event.body);
    return {
      statusCode: 200,
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
