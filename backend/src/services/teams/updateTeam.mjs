import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const teamsTableName = process.env.TEAMS_TABLE_NAME || "TeamsTable";

const updateTeamsFunction = async (teamId, body) => {
  // based on the body of what is being updated, update the following:
  //  - team name
  //  - team members (this might be a replacement or a )
  try {
    if (!teamId || Object.keys(body).length === 0) {
      throw new Error("teamIds and updates must be passed in to the function");
    }

    // TODO - work out what needs to be updated

    // TODO - make a batch updated like the batch insert function
  } catch (error) {
    throw new Error("Failed to get teams", { cause: error });
  }
};

export default updateTeamsFunction;
