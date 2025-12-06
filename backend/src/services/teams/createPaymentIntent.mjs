import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_123456789";

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

const createPaymentIntentFunction = async (teamId, eventId, userId, amount) => {
  if (!teamId || !eventId || !userId || !amount) {
    throw new Error("teamId, eventId, userId, and amount are required");
  }

  if (typeof amount !== "number" || amount < 100 || amount > 1000000 || !Number.isInteger(amount)) {
    throw new Error("Amount must be an integer between 100 (£1) and 1000000 (£10000) pence");
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
        userId,
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
