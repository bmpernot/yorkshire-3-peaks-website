import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const teamMembersTableName = process.env.TEAM_MEMBERS_TABLE_NAME || "TeamMembersTable";

const getTeamsFunction = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId must be passed in");
    }

    const data = await ddbDocClient.send(
      new QueryCommand({
        TableName: teamMembersTableName,
        IndexName: "UserIdIndex",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      }),
    );

    return data.Items || [];
  } catch (error) {
    throw new Error("Failed to get teams", { cause: error });
  }
};

export default getTeamsFunction;
