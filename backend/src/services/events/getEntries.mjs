import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const entriesTableName = process.env.EVENTS_TABLE_NAME;

const getEntriesFunction = async (eventId) => {
  const allEntries = [];
  let lastEvaluatedKey;

  try {
    do {
      const params = {
        TableName: entriesTableName,
        KeyConditionExpression: "eventId = :eventId",
        ExpressionAttributeValues: {
          ":eventId": eventId,
        },
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const data = await ddbDocClient.send(new QueryCommand(params));
      if (data.Items) {
        allEntries.push(...data.Items);
      }

      lastEvaluatedKey = data.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return allEntries;
  } catch (error) {
    throw new Error("Failed to get entries from DynamoDB", { cause: error });
  }
};

export default getEntriesFunction;
