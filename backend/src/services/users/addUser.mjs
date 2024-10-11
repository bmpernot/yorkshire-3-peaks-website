import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { isValidUserObject } from "../../utils/users.mjs";
import { DynamoDBClientConfig } from "../../utils/dbConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const userTable = process.env.USER_TABLE;

const addUser = async ({ userObject }) => {
  if (!isValidUserObject(userObject)) {
    throw new Error(`addUser only accepts the certain data`);
  }

  const params = {
    TableName: userTable,
    Item: {
      id: userObject.id,
      firstName: userObject.firstName,
      lastName: userObject.lastName,
      email: userObject.email,
      number: userObject.number,
      iceNumber: userObject.iceNumber,
      role: "USER",
    },
  };

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    return data;
  } catch (error) {
    throw new Error(`An error occurred when tring to add a user`, { cause: error });
  }
};

export default addUser;
