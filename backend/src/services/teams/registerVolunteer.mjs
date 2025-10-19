import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const entriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";
const teamMembersTableName = process.env.TEAM_MEMBERS_TABLE_NAME || "TeamMembersTable";

const registerVolunteerFunction = async (eventId, userId) => {
  try {
    if (!eventId || !userId) {
      throw new Error("Both eventId and UserID must be specified");
    }

    // TODO - handle if the user is already apart of the team

    // TODO - get TeamID from entries table where eventId = eventId and volunteer = true (boolean)

    // TODO - insert user into team members table using teamId and userId with the additional requirements attribute
  } catch (error) {
    throw new Error("Failed to register user in volunteers team", { cause: error });
  }
};

export default registerVolunteerFunction;
