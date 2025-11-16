import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const ddbClient = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const usersTableName = process.env.USERS_TABLE_NAME || "UsersTable";

const updateUser = async ({ userId, firstName, lastName, email }) => {
  try {
    if (!userId || !firstName || !lastName) {
      throw new Error("Missing required fields: userId, firstName, lastName and email");
    }

    const searchValue = `${firstName.toLowerCase()} ${lastName.toLowerCase()} ${email.toLowerCase()}`;

    await ddbDocClient.send(
      new UpdateCommand({
        TableName: usersTableName,
        Key: { userId },
        UpdateExpression:
          "SET firstName = :firstName, lastName = :lastName, email = :email, searchValue = :searchValue",
        ExpressionAttributeValues: {
          ":firstName": firstName,
          ":lastName": lastName,
          ":email": email,
          ":searchValue": searchValue,
        },
        ReturnValues: "ALL_NEW",
      }),
    );

    return { success: true, userId };
  } catch (error) {
    throw new Error("Failed to update user in DynamoDB", { cause: error });
  }
};

export default updateUser;
