import Stripe from "stripe";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const ddbClient = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const entriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_123456789";
const stripeWebhookSecretKey = process.env.STRIPE_WEBHOOK_SECRET_KEY || "sk_test_987654321";

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

const updateEntryWithPaidAmountFunction = async (stripeSignature, webhookBody) => {
  if (!stripeSignature) {
    throw new Error("Missing stripe-signature header");
  }
  if (!webhookBody) {
    throw new Error("Missing webhook body");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(webhookBody, stripeSignature, stripeWebhookSecretKey);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    throw new Error("Webhook signature verification failed", { cause: error });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const { metadata, amount_received } = event.data.object;
      const { teamId, eventId } = metadata;

      if (!teamId || !eventId) {
        throw new Error(`Missing required metadata: teamId=${teamId}, eventId=${eventId}`);
      }

      const amountPaid = amount_received / 100;

      const response = await ddbDocClient.send(
        new UpdateCommand({
          TableName: entriesTableName,
          Key: { teamId, eventId },
          UpdateExpression: "SET paid = if_not_exists(paid, :zero) + :increment",
          ExpressionAttributeValues: {
            ":increment": amountPaid,
            ":zero": 0,
          },
          ReturnValues: "ALL_NEW",
        }),
      );

      return response;
    }
  } catch (error) {
    console.error("Failed to update entry with amount paid:", error);
    throw new Error("Failed to update entry with amount paid", { cause: error });
  }
};

export default updateEntryWithPaidAmountFunction;
