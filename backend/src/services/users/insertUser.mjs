import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const ddbClient = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const usersTableName = process.env.USERS_TABLE_NAME || "UsersTable";

const insertUser = async ({ userId, firstName, lastName, email }) => {
  try {
    if (!userId || !firstName || !lastName || !email) {
      throw new Error("Missing required user fields");
    }

    const searchValue = `${firstName.toLowerCase()} ${lastName.toLowerCase()} ${email.toLowerCase()}`;

    await ddbDocClient.send(
      new PutCommand({
        TableName: usersTableName,
        Item: {
          userId,
          firstName,
          lastName,
          email,
          searchValue,
        },
      }),
    );

    return { success: true, userId };
  } catch (error) {
    throw new Error("Failed to insert user into DynamoDB", { cause: error });
  }
};

export default insertUser;
