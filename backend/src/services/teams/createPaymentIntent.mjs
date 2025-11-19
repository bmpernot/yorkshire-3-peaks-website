import Stripe from "stripe";

// TODO - update to the latest api version before deployment
const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

const createPaymentIntentFunction = async (teamId, eventId, amount) => {
  if (!amount) {
    throw new Error("Amount is required");
  }

  try {
    const response = await stripe.paymentIntents.create({
      amount: amount,
      currency: "GBP",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        teamId,
        eventId,
      },
    });

    return {
      paymentIntentId: response?.id,
      clientSecret: response?.client_secret,
    };
  } catch (error) {
    throw new Error("Failed to create Payment Intent", { cause: error });
  }
};

export default createPaymentIntentFunction;
