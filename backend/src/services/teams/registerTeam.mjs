import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";
import { v4 } from "uuid";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const teamsTableName = process.env.TEAMS_TABLE_NAME || "TeamsTable";
const EntriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";
const TeamMembersTableName = process.env.TEAM_MEMBERS_TABLE_NAME || "TeamMembersTable";
const eventsTableName = process.env.EVENTS_TABLE_NAME || "EventsTable";

const registerTeamFunction = async (eventId, teamInformation) => {
  try {
    const eventData = await ddbDocClient.send(new GetCommand({ TableName: eventsTableName, Key: { eventId } }));
    if (!eventData.Item) {
      throw new Error(`Event with ID ${eventId} not found`);
    }
    const eventInfo = eventData.Item;

    const teamId = v4();
    await ddbDocClient.send(
      new PutCommand({
        TableName: teamsTableName,
        Item: { teamId, teamName: teamInformation.teamName },
      }),
    );

    const now = new Date();
    const price =
      eventInfo.earlyBirdEndDate && now <= new Date(eventInfo.earlyBirdEndDate)
        ? eventInfo.earlyBirdPrice
        : eventInfo.price;

    await ddbDocClient.send(
      new PutCommand({
        TableName: EntriesTableName,
        Item: {
          eventId,
          teamId,
          cost: price * teamInformation.members.length,
          paid: 0,
        },
      }),
    );

    for (const member of teamInformation.members) {
      await ddbDocClient.send(
        new PutCommand({
          TableName: TeamMembersTableName,
          Item: {
            teamId,
            userId: member.userId,
            eventId,
            additionalRequirements: member.additionalRequirements || null,
            willingToVolunteer: member.WillingToVolunteer || false,
          },
          ConditionExpression: "attribute_not_exists(teamId) AND attribute_not_exists(userId)",
        }),
      );
    }

    return { teamId, message: `Team ${teamInformation.teamName} registered successfully` };
  } catch (error) {
    throw new Error("Failed to register team", { cause: error });
  }
};

export default registerTeamFunction;
