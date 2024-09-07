import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
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

  const body = event.body;
  const id = body.id;
  const name = body.name;

  const params = {
    TableName: tableName,
    Item: { id: id, name: name },
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

  const newData = event.body;
  const id = event.pathParameters.id;

  let updateExpression = "set";

  if (newData.firstName) {
    updateExpression += " firstName = firstName,";
  }
  if (newData.lastName) {
    updateExpression += " lastName = lastName,";
  }
  if (newData.email) {
    updateExpression += " email = email,";
  }
  if (newData.number) {
    updateExpression += " number = number,";
  }
  if (newData.iceNumber) {
    updateExpression += " iceNumber = iceNumber,";
  }
  if (newData.role) {
    updateExpression += " role = role,";
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
    ExpressionAttributeValues: newData,
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
