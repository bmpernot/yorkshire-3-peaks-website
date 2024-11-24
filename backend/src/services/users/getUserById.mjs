import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/dbConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const userTable = process.env.USER_TABLE;

const getUserById = async ({ id }) => {
  const params = {
    TableName: userTable,
    Key: { id: id },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    return data.Item;
  } catch (error) {
    throw new Error(`An error occurred when tring to get the user with the id of: ${id}`, { cause: error });
  }
};

export default getUserById;
