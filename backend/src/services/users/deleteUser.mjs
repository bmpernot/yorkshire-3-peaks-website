import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const ddbClient = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const usersTableName = process.env.USERS_TABLE_NAME || "UsersTable";

const deleteUser = async ({ userId }) => {
  try {
    if (!userId) {
      throw new Error("Missing required fields: userId");
    }

    await ddbDocClient.send(
      new DeleteCommand({
        TableName: usersTableName,
        Key: { userId },
        ConditionExpression: "attribute_exists(userId)",
      }),
    );

    return { success: true, userId };
  } catch (error) {
    throw new Error("Failed to delete user in DynamoDB", { cause: error });
  }
};

export default deleteUser;
