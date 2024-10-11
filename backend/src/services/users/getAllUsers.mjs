import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/dbConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const userTable = process.env.USER_TABLE;

const getAllUsers = async () => {
  const params = {
    TableName: userTable,
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    return data;
  } catch (error) {
    throw new Error("An error occurred when tring to get all users", { cause: error });
  }
};

export default getAllUsers;
