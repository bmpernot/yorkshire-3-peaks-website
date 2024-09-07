import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.SAMPLE_TABLE;

export const getById = async (event) => {
  if (event.httpMethod !== "GET") {
    const response = {
      statusCode: 405,
      body: new Error(
        `getById only accepts GET method, you tried: ${event.httpMethod}`
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
        `An error occurred when try to get the item with the id of: ${id}`,
        { cause: error }
      ),
    };

    return response;
  }
};
