import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchGetCommand } from "@aws-sdk/lib-dynamodb";
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

    const teamIdKeys = teamIds.map(({ teamId }) => ({ teamId }));

    const firstParams = {
      RequestItems: {
        [teamsTableName]: {
          Keys: teamIdKeys,
        },
        [teamMembersTableName]: {
          Keys: teamIdKeys,
        },
        [entriesTableName]: {
          Keys: teamIdKeys,
        },
      },
    };

    const {
      [teamsTableName]: teams,
      [teamMembersTableName]: members,
      [entriesTableName]: entries,
    } = (await ddbDocClient.send(new BatchGetCommand(firstParams))).Responses;

    const eventIdKeys = entries.map(({ eventId }) => ({ eventId }));
    const userIdKeys = members.map(({ userId }) => ({ userId }));

    const secondParams = {
      RequestItems: {
        [eventsTableName]: {
          Keys: eventIdKeys,
        },
      },
    };

    let users, events;

    if (!userRole.includes("Organiser") && !userRole.includes("Admin")) {
      secondParams.RequestItems[usersTableName] = {
        Keys: userIdKeys,
      };

      const data = (await ddbDocClient.send(new BatchGetCommand(secondParams))).Responses;

      events = data[eventsTableName];
      users = data[usersTableName];
    } else {
      const [data, usersData] = await Promise.all([
        ddbDocClient.send(new BatchGetCommand(secondParams)),
        getUsersFunction("sub,given_name,family_name,email,ice_number,phone_number", userIdKeys),
      ]);
      events = data.Responses[eventsTableName];
      users = usersData.map((userData) => ({
        userId: userData.sub,
        email: userData.email,
        firstName: userData.given_name,
        lastName: userData.family_name,
        iceNumber: userData["custom:ice_number"],
        number: userData.phone_number,
      }));
    }

    const teamObjects = teamIds.map((teamId) => {
      const team = teams.find((team) => team.teamId === teamId);
      const membersEventInformation = members.filter((teamMember) => teamMember.teamId === teamId);
      const teamMemberIds = membersEventInformation.map((teamMember) => teamMember.userId);
      const entry = entries.find((entry) => entry.teamId === teamId);
      const event = events.find((event) => event.eventId === entry.eventId);
      const membersPersonalInformation = users.filter((user) => teamMemberIds.includes(user.userId));

      return {
        teamId: teamId,
        teamName: team.teamName,
        members: teamMemberIds.map((teamMemberId) => {
          const memberEventInformation = membersEventInformation.find((user) => user.userId === teamMemberId);
          const memberPersonalInformation = membersPersonalInformation.find((user) => user.userId === teamMemberId);

          return {
            ...memberPersonalInformation,
            additionalRequirements: memberEventInformation.additionalRequirements || null,
            willingToVolunteer: memberEventInformation.willingToVolunteer || false,
          };
        }),
        volunteer: entry.volunteer,
        cost: entry.cost,
        paid: entry.paid,
        eventId: event.eventId,
        startDate: event.startDate,
        endDate: event.endDate,
      };
    });

    return teamObjects;
  } catch (error) {
    throw new Error("Failed to get teams", { cause: error });
  }
};

export default getTeamsFunction;
