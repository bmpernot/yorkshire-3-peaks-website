import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.SAMPLE_TABLE;

export const getAllItems = async (event) => {
  if (event.httpMethod !== "GET") {
    const response = {
      statusCode: 405,
      body: new Error(
        `getAllItems only accepts GET method, you tried: ${event.httpMethod}`
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
      body: new Error("An error occurred when try to get all items", {
        cause: error,
      }),
    };

    return response;
  }
};
