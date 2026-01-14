import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";
import { v4 } from "uuid";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const eventsTableName = process.env.EVENTS_TABLE_NAME || "EventsTable";
const teamsTableName = process.env.TEAMS_TABLE_NAME || "TeamsTable";
const entriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";

const registerEventFunction = async (eventData, userId) => {
  const eventId = v4();
  const volunteerTeamId = v4();

  try {
    await ddbDocClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: eventsTableName,
              Item: {
                eventId,
                startDate: eventData.startDate,
                endDate: eventData.endDate,
                requiredWalkers: eventData.requiredWalkers,
                requiredVolunteers: eventData.requiredVolunteers,
                earlyBirdPrice: eventData.earlyBirdPrice,
                earlyBirdCutoff: eventData.earlyBirdCutoff,
                price: eventData.price,
                createdBy: userId,
                createdAt: new Date().toISOString(),
              },
            },
          },
          {
            Put: {
              TableName: teamsTableName,
              Item: {
                teamId: volunteerTeamId,
                teamName: "Volunteers",
              },
            },
          },
          {
            Put: {
              TableName: entriesTableName,
              Item: {
                eventId,
                teamId: volunteerTeamId,
                volunteer: "true",
                cost: 0,
                paid: 0,
              },
            },
          },
        ],
      }),
    );

    return { eventId, message: "Event registered successfully" };
  } catch (error) {
    throw new Error("Failed to register event", { cause: error });
  }
};

export default registerEventFunction;
