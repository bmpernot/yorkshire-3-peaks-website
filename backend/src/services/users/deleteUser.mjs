import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/dbConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const userTable = process.env.USER_TABLE;

const deleteUser = async ({ id }) => {
  const params = {
    TableName: userTable,
    Key: { id: id },
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
  } catch (error) {
    throw new Error(`An error occurred when tring delete user with id: ${id}`, { cause: error });
  }
};

export default deleteUser;
