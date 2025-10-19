import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const eventsTableName = process.env.EVENTS_TABLE_NAME || "EventsTable";
const entriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";

const getEventInformation = async (eventId) => {
  const allEvents = [];
  let lastEvaluatedKey;

  // TODO - get all entries for event to get the:  number of volunteers -  number of walkers - money raised
  // TODO - get the event information to get the: requiredWalkers - requiredVolunteers - startDate - endDate - eventId

  try {
    do {
      const params = {
        TableName: eventsTableName,
        ProjectionExpression: "eventId, startDate, endDate",
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const data = await ddbDocClient.send(new ScanCommand(params));

      if (data.Items) {
        allEvents.push(...data.Items);
      }

      lastEvaluatedKey = data.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return allEvents;
  } catch (error) {
    throw new Error("Failed to get events", { cause: error });
  }
};

export default getEventInformation;
