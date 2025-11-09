import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const entriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";
const teamMembersTableName = process.env.TEAM_MEMBERS_TABLE_NAME || "TeamMembersTable";

const registerVolunteerFunction = async (eventId, userId, additionalRequirements) => {
  try {
    if (!eventId || !userId) {
      throw new Error("Both eventId and userId must be specified");
    }

    const existingEntry = await ddbDocClient.send(
      new QueryCommand({
        TableName: teamMembersTableName,
        IndexName: "UserIdIndex",
        KeyConditionExpression: "userId = :userId",
        FilterExpression: "#eventId = :eventId",
        ExpressionAttributeNames: {
          "#eventId": "eventId",
        },
        ExpressionAttributeValues: {
          ":userId": userId,
          ":eventId": eventId,
        },
      }),
    );

    if (existingEntry.Items && existingEntry.Items.length > 0) {
      throw new Error("User is already part of a team for this event");
    }

    const volunteerTeamQuery = await ddbDocClient.send(
      new QueryCommand({
        TableName: entriesTableName,
        IndexName: "VolunteerIndex",
        KeyConditionExpression: "#volunteer = :true",
        FilterExpression: "#eventId = :eventId",
        ExpressionAttributeNames: {
          "#volunteer": "volunteer",
          "#eventId": "eventId",
        },
        ExpressionAttributeValues: {
          ":true": true,
          ":eventId": eventId,
        },
      }),
    );

    if (!volunteerTeamQuery.Items || volunteerTeamQuery.Items.length === 0) {
      throw new Error(`No volunteer team found for eventId: ${eventId}`);
    }

    const volunteerTeam = volunteerTeamQuery.Items[0];
    const teamId = volunteerTeam.teamId;

    const newMember = {
      eventId,
      teamId,
      userId,
      additionalRequirements: additionalRequirements || null,
      willingToVolunteer: true,
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: teamMembersTableName,
        Item: newMember,
        ConditionExpression: "attribute_not_exists(teamId) AND attribute_not_exists(userId)",
      }),
    );

    return {
      success: true,
      message: `User ${userId} added to volunteer team ${teamId}`,
    };
  } catch (error) {
    console.error("registerVolunteerFunction error:", error);
    throw new Error("Failed to register user in volunteer team", { cause: error });
  }
};

export default registerVolunteerFunction;
