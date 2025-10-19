import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const teamsTableName = process.env.TEAMS_TABLE_NAME || "TeamsTable";
const EntriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";
const TeamMembersTableName = process.env.TEAM_MEMBERS_TABLE_NAME || "TeamMembersTable";
const eventsTableName = process.env.EVENTS_TABLE_NAME || "EventsTable";

const registerTeamFunction = async (eventId, teamInformation) => {
  try {
    // TODO - handle if any member is already apart of a team
    // TODO - get the event information using eventId
    // TODO - create the teamsTable entry - get and store the UUID
    // TODO - create the Entry for the Team - cost = number of member * by the price/earlybirdPrice (depending on the early bird date) from event information with teamId and eventId
    // TODO - for each member in the teamInformation create an entry with each members details for the created team
  } catch (error) {
    throw new Error("Failed to register team", { cause: error });
  }
};

export default registerTeamFunction;
