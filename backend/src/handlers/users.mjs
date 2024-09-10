import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const DynamoDBClientConfig = process.env.AWS_SAM_LOCAL
  ? {
      endpoint: "http://dynamodb-local:8000",
      region: "local",
    }
  : { region: process.env.AWS_REGION || "eu-west-2" };

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.USER_TABLE;

const getAllUsers = async (event) => {
  if (event.httpMethod !== "GET") {
    const response = {
      statusCode: 405,
      body: new Error(
        `getAllUsers only accepts GET method, you tried: ${event.httpMethod}`
      ),
    };

    return response;
  }

  console.info("Received: ", event);

  const params = {
    TableName: tableName,
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    const items = data.Items;

    console.info(`Response from: ${event.path}, ${items}`);

    const response = {
      statusCode: 200,
      body: items,
    };

    return response;
  } catch (error) {
    console.error("Error: ", error);

    const response = {
      statusCode: 500,
      body: new Error("An error occurred when tring to get all users", {
        cause: error,
      }),
    };

    return response;
  }
};

const getUserById = async (event) => {
  if (event.httpMethod !== "GET") {
    const response = {
      statusCode: 405,
      body: new Error(
        `getUserById only accepts GET method, you tried: ${event.httpMethod}`
      ),
    };

    return response;
  }

  console.info("Received: ", event);

  const id = event.pathParameters.id;

  const params = {
    TableName: tableName,
    Key: { id: id },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    const item = data.Item;

    console.info(`Response from: ${event.path}, ${item}`);

    const response = {
      statusCode: 200,
      body: item,
    };

    return response;
  } catch (error) {
    console.error("Error: ", error);

    const response = {
      statusCode: 500,
      body: new Error(
        `An error occurred when tring to get the user with the id of: ${id}`,
        { cause: error }
      ),
    };

    return response;
  }
};

const addUser = async (event) => {
  if (event.httpMethod !== "POST") {
    const response = {
      statusCode: 405,
      body: new Error(
        `addUser only accepts POST method, you tried: ${event.httpMethod}`
      ),
    };

    return response;
  }

  console.info("Received: ", event);

  const userObject = JSON.parse(event.body);

  if (!isValidUserObject(userObject)) {
    const response = {
      statusCode: 400,
      body: new Error(`addUser only accepts the certain data`),
    };

    return response;
  }

  const params = {
    TableName: tableName,
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

    console.info(
      `Response from: ${event.path}, Success - user added", ${data}`
    );

    const response = {
      statusCode: 201,
    };

    return response;
  } catch (error) {
    console.error("Error: ", error);

    const response = {
      statusCode: 500,
      body: new Error(
        `An error occurred when tring to add a user in ${tableName}`,
        { cause: error }
      ),
    };

    return response;
  }
};

const updateUser = async (event) => {
  if (event.httpMethod !== "PUT") {
    const response = {
      statusCode: 405,
      body: new Error(
        `updateUser only accepts PUT method, you tried: ${event.httpMethod}`
      ),
    };

    return response;
  }

  console.info("Received: ", event);

  const newUserData = JSON.parse(event.body);
  const id = event.pathParameters.id;

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
    const response = {
      statusCode: 400,
      body: new Error(
        `updateUser needs acceptable data for it to update the user`
      ),
    };

    return response;
  }

  const params = {
    TableName: tableName,
    Key: { id: id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));

    console.info(
      `Response from: ${event.path}, Success - user updated, ${data.Attributes}`
    );

    const response = {
      statusCode: 200,
      body: data.Attributes,
    };

    return response;
  } catch (error) {
    console.error("Error: ", error);

    const response = {
      statusCode: 500,
      body: new Error(
        `An error occurred when tring to update a user in ${tableName}`,
        { cause: error }
      ),
    };

    return response;
  }
};

const deleteUser = async (event) => {
  if (event.httpMethod !== "DELETE") {
    const response = {
      statusCode: 405,
      body: new Error(
        `deleteUser only accepts DELETE method, you tried: ${event.httpMethod}`
      ),
    };

    return response;
  }

  console.info("Received: ", event);

  const id = event.pathParameters.id;

  const params = {
    TableName: tableName,
    Key: { id: id },
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
    console.info(`Response from: ${event.path}, Success - user ${id} deleted`);

    const response = {
      statusCode: 204,
    };

    return response;
  } catch (error) {
    console.error("Error: ", error);

    const response = {
      statusCode: 500,
      body: new Error(
        `An error occurred when tring delete user with id: ${id}`,
        {
          cause: error,
        }
      ),
    };

    return response;
  }
};

export { addUser, getUserById, getAllUsers, updateUser, deleteUser };

function isValidUserObject(userObject) {
  if (!userObject.id) {
    return false;
  }
  if (!userObject.firstName) {
    return false;
  }
  if (!userObject.lastName) {
    return false;
  }
  if (!userObject.email) {
    return false;
  }
  if (!userObject.number) {
    return false;
  }
  if (!userObject.iceNumber) {
    return false;
  }

  return true;
}
