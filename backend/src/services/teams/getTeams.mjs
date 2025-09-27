import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const teamsTableName = process.env.TEAMS_TABLE_NAME || "TeamsTable";

const getTeamsFunction = async (teamIds) => {
  try {
    if (!Array.isArray(teamIds) || teamIds.length === 0) {
      throw new Error("teamIds must be a non-empty array");
    }

    const keys = teamIds.map((id) => ({ teamId: id }));

    const params = {
      RequestItems: {
        [teamsTableName]: {
          Keys: keys,
        },
      },
    };

    const data = await ddbDocClient.send(new BatchGetCommand(params));

    return data.Responses?.[teamsTableName] || [];
  } catch (error) {
    throw new Error("Failed to get teams", { cause: error });
  }
};

export default getTeamsFunction;
