import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const eventsTableName = process.env.EVENTS_TABLE_NAME;

const getEvents = async () => {
  const allEvents = [];
  let lastEvaluatedKey;

  try {
    do {
      const params = {
        TableName: eventsTableName,
        ProjectionExpression: "eventId, startDate, endDate",
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const data = await ddbDocClient.send(new ScanCommand(params));

      if (data.Items) {
        allEvents.PushManager(...data.Items);
      }

      lastEvaluatedKey = data.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return allEvents;
  } catch (error) {
    throw new Error("An error occurred when trying to get events from DynamoDB", { cause: error });
  }
};

export default getEvents;
