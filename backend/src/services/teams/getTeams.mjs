import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchGetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";
import getUsersFunction from "../../services/users/getUsers.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const teamsTableName = process.env.TEAMS_TABLE_NAME || "TeamsTable";
const entriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";
const teamMembersTableName = process.env.TEAM_MEMBERS_TABLE_NAME || "TeamMembersTable";
const eventsTableName = process.env.EVENTS_TABLE_NAME || "EventsTable";
const usersTableName = process.env.USERS_TABLE_NAME || "UsersTable";

const getTeamsFunction = async (teamIds, userRole) => {
  try {
    if (!Array.isArray(teamIds) || teamIds.length === 0) {
      throw new Error("teamIds must be a non-empty array");
    }

    const teamIdKeys = teamIds.map((teamId) => ({ teamId }));

    const teamsResult = await ddbDocClient.send(
      new BatchGetCommand({
        RequestItems: {
          [teamsTableName]: {
            Keys: teamIdKeys,
          },
        },
      }),
    );

    const teams = teamsResult.Responses[teamsTableName] || [];

    const memberQueries = teamIds.map((teamId) =>
      ddbDocClient.send(
        new QueryCommand({
          TableName: teamMembersTableName,
          KeyConditionExpression: "teamId = :teamId",
          ExpressionAttributeValues: { ":teamId": teamId },
        }),
      ),
    );

    const memberResults = await Promise.all(memberQueries);
    const allMembers = memberResults.flatMap((result) => result.Items);

    const entryQueries = teamIds.map((teamId) =>
      ddbDocClient.send(
        new QueryCommand({
          TableName: entriesTableName,
          IndexName: "TeamIdIndex",
          KeyConditionExpression: "teamId = :teamId",
          ExpressionAttributeValues: { ":teamId": teamId },
        }),
      ),
    );

    const entryResults = await Promise.all(entryQueries);
    const allEntries = entryResults.flatMap((result) => result.Items);

    const eventIdKeys = [...new Set(allEntries.map((entry) => entry.eventId))].map((eventId) => ({ eventId }));

    const eventsResult = await ddbDocClient.send(
      new BatchGetCommand({
        RequestItems: {
          [eventsTableName]: {
            Keys: eventIdKeys,
          },
        },
      }),
    );

    const events = eventsResult.Responses[eventsTableName] || [];

    const uniqueUserIds = [...new Set(allMembers.map((member) => member.userId))].map((userId) => ({ userId }));

    let users;

    const isPrivileged = userRole.includes("Organiser") || userRole.includes("Admin");

    if (!isPrivileged) {
      if (uniqueUserIds.length > 0) {
        const usersResult = await ddbDocClient.send(
          new BatchGetCommand({
            RequestItems: {
              [usersTableName]: { Keys: uniqueUserIds },
            },
          }),
        );

        users = usersResult.Responses[usersTableName] || [];
      } else {
        users = [];
      }
    } else {
      const rawUsers = await getUsersFunction(
        "sub,given_name,family_name,email,ice_number,phone_number",
        uniqueUserIds.map((userId) => userId.userId),
      );

      users = rawUsers.map((user) => ({
        userId: user.sub,
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name,
        iceNumber: user["custom:ice_number"],
        number: user.phone_number,
      }));
    }

    const teamObjects = teamIds.map((teamId) => {
      const team = teams.find((team) => team.teamId === teamId);
      const members = allMembers.filter((member) => member.teamId === teamId);
      const entry = allEntries.find((entry) => entry.teamId === teamId);

      const event = events.find((event) => event.eventId === entry.eventId);

      const memberDetails = members.map((memberRow) => {
        const personal = users.find((user) => user.userId === memberRow.userId);
        return {
          ...personal,
          additionalRequirements: memberRow.additionalRequirements ?? null,
          willingToVolunteer: memberRow.willingToVolunteer ?? false,
        };
      });

      return {
        teamId,
        teamName: team?.teamName,
        members: memberDetails,
        volunteer: entry?.volunteer,
        cost: entry?.cost,
        paid: entry?.paid,
        eventId: event?.eventId,
        startDate: event?.startDate,
        endDate: event?.endDate,
      };
    });

    return teamObjects;
  } catch (error) {
    console.error("getTeamsFunction error:", { teamIds, userRole, error: error.message });
    throw new Error("Failed to get teams", { cause: error });
  }
};

export default getTeamsFunction;
