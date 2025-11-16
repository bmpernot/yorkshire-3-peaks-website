import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const eventsTableName = process.env.EVENTS_TABLE_NAME || "EventsTable";
const entriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";
const teamMembersTableName = process.env.TEAM_MEMBERS_TABLE_NAME || "TeamMembersTable";

const getEventInformation = async (eventId) => {
  if (!eventId) {
    throw new Error("Missing eventId parameter");
  }

  try {
    const eventResult = await ddbDocClient.send(
      new GetCommand({
        TableName: eventsTableName,
        Key: { eventId },
      }),
    );

    const event = eventResult.Item;

    if (!event) {
      throw new Error(`Event not found for ID: ${eventId}`);
    }

    const entriesData = await ddbDocClient.send(
      new QueryCommand({
        TableName: entriesTableName,
        KeyConditionExpression: "eventId = :eventId",
        ExpressionAttributeValues: { ":eventId": eventId },
        ProjectionExpression: "teamId, volunteer, paid",
      }),
    );

    const entries = entriesData.Items || [];

    if (entries.length === 0) {
      return {
        eventId: event.eventId,
        startDate: event.startDate,
        endDate: event.endDate,
        requiredWalkers: event.requiredWalkers,
        requiredVolunteers: event.requiredVolunteers,
        currentVolunteers: 0,
        currentWalkers: 0,
        moneyRaised: 0,
      };
    }

    const moneyRaised = entries.reduce((sum, entry) => sum + (Number(entry.paid) || 0), 0);

    const membersData = await ddbDocClient.send(
      new QueryCommand({
        TableName: teamMembersTableName,
        IndexName: "EventIdIndex",
        KeyConditionExpression: "eventId = :eventId",
        ExpressionAttributeValues: { ":eventId": eventId },
        ProjectionExpression: "teamId",
      }),
    );

    const members = membersData.Items || [];

    const teamCountsMap = {};
    members.forEach(({ teamId }) => {
      teamCountsMap[teamId] = (teamCountsMap[teamId] || 0) + 1;
    });

    let currentVolunteers = 0;
    let currentWalkers = 0;

    entries.forEach(({ teamId, volunteer }) => {
      const count = teamCountsMap[teamId] || 0;
      const isVolunteer = volunteer ? volunteer === "true" : false;
      if (isVolunteer) {
        currentVolunteers += count;
      } else {
        currentWalkers += count;
      }
    });

    return {
      eventId: event.eventId,
      startDate: event.startDate,
      endDate: event.endDate,
      requiredWalkers: event.requiredWalkers,
      requiredVolunteers: event.requiredVolunteers,
      currentVolunteers,
      currentWalkers,
      moneyRaised,
    };
  } catch (error) {
    console.error("Error fetching event information:", error);
    throw new Error("Failed to get event information", { cause: error });
  }
};

export default getEventInformation;
