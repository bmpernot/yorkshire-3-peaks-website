import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";
import { v4 } from "uuid";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const teamsTableName = process.env.TEAMS_TABLE_NAME || "TeamsTable";
const entriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";
const teamMembersTableName = process.env.TEAM_MEMBERS_TABLE_NAME || "TeamMembersTable";
const eventsTableName = process.env.EVENTS_TABLE_NAME || "EventsTable";

const registerTeamFunction = async (eventId, teamInformation) => {
  try {
    const eventData = await ddbDocClient.send(new GetCommand({ TableName: eventsTableName, Key: { eventId } }));

    if (!eventData.Item) {
      throw new Error(`Event with ID ${eventId} not found`);
    }
    const eventInfo = eventData.Item;
    const now = new Date();
    const teamId = v4();

    const price =
      eventInfo.earlyBirdCutoff && now <= new Date(eventInfo.earlyBirdCutoff)
        ? eventInfo.earlyBirdPrice
        : eventInfo.price;

    const transactItems = [
      {
        Put: {
          TableName: teamsTableName,
          Item: {
            teamId,
            teamName: teamInformation.teamName,
          },
        },
      },
      {
        Put: {
          TableName: entriesTableName,
          Item: {
            eventId,
            teamId,
            volunteer: String(false),
            cost: price * teamInformation.members.length,
            paid: 0,
          },
        },
      },
      ...teamInformation.members.map((member) => ({
        Put: {
          TableName: teamMembersTableName,
          Item: {
            teamId,
            userId: member.userId,
            eventId,
            additionalRequirements: member.additionalRequirements || null,
            willingToVolunteer: member.willingToVolunteer || false,
          },
          ConditionExpression: "attribute_not_exists(teamId) AND attribute_not_exists(userId)",
        },
      })),
    ];
    await ddbDocClient.send(
      new TransactWriteCommand({
        TransactItems: transactItems,
      }),
    );

    return { teamId, message: `Team ${teamInformation.teamName} registered successfully` };
  } catch (error) {
    throw new Error("Failed to register team", { cause: error });
  }
};

export default registerTeamFunction;
