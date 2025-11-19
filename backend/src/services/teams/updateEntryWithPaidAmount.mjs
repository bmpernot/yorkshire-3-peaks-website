import Stripe from "stripe";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const ddbClient = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const entriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";

// TODO - update to the latest api version before deployment
const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

const updateEntryWithPaidAmountFunction = async (stripeSignature, webhookBody) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(webhookBody, stripeSignature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    throw new Error("Webhook signature verification failed", { cause: error });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const { metadata, amount_received } = event.data.object;
      const { teamId, eventId } = metadata;
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
    throw new Error("Failed to update entry with amount paid", { cause: error });
  }
};

export default updateEntryWithPaidAmountFunction;
