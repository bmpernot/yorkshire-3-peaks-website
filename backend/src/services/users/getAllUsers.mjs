import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/dbConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const userTable = process.env.USER_TABLE;

const defaultFields = ["id", "email"];

const getAllUsers = async (fields) => {
  const params = {
    TableName: userTable,
  };

  const mergedFields = Array.from(new Set([...fields, ...defaultFields]));

  // TODO - need to implement pagination eventually as dynamo has a max of 1MB

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));

    const filteredUsers = data.Items.map((user) => {
      return mergedFields.reduce((filtered, field) => {
        if (field in user) {
          filtered[field] = user[field];
        }
        return filtered;
      }, {});
    });

    return filteredUsers;
  } catch (error) {
    throw new Error("An error occurred when tring to get all users", { cause: error });
  }
};

export default getAllUsers;
