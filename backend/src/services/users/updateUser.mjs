import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/dbConfig.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const userTable = process.env.USER_TABLE;

const updateUser = async ({ newUserData, id }) => {
  let updateExpression = "set";
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  if (newUserData.firstName) {
    updateExpression += " firstName = :firstName,";
    ExpressionAttributeValues[":firstName"] = newUserData.firstName;
  }
  if (newUserData.lastName) {
    updateExpression += " lastName = :lastName,";
    ExpressionAttributeValues[":lastName"] = newUserData.lastName;
  }
  if (newUserData.email) {
    updateExpression += " email = :email,";
    ExpressionAttributeValues[":email"] = newUserData.email;
  }
  if (newUserData.number) {
    updateExpression += " #numberAttribute = :number,";
    ExpressionAttributeNames["#numberAttribute"] = "number";
    ExpressionAttributeValues[":number"] = newUserData.number;
  }
  if (newUserData.iceNumber) {
    updateExpression += " iceNumber = :iceNumber,";
    ExpressionAttributeValues[":iceNumber"] = newUserData.iceNumber;
  }
  if (newUserData.role) {
    updateExpression += " role = :role,";
    ExpressionAttributeValues[":role"] = newUserData.role;
  }

  if (updateExpression.slice(-1) === ",") {
    updateExpression = updateExpression.slice(0, -1);
  } else {
    throw new Error(`updateUser needs acceptable data for it to update the user`);
  }

  const params = {
    TableName: userTable,
    Key: { id: id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));
    return data;
  } catch (error) {
    throw new Error(`An error occurred when tring to update the user`, { cause: error });
  }
};

export default updateUser;
