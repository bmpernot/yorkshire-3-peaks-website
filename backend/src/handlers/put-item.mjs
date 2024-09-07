import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.SAMPLE_TABLE;

export const putItem = async (event) => {
  if (event.httpMethod !== "POST") {
    const response = {
      statusCode: 405,
      body: new Error(
        `putItem only accepts POST method, you tried: ${event.httpMethod}`
      ),
    };

    return response;
  }

  console.info("Received: ", event);

  const body = JSON.parse(event.body);
  const id = body.id;
  const name = body.name;

  const params = {
    TableName: tableName,
    Item: { id: id, name: name },
  };

  try {
    const data = await ddbDocClient.send(new PutCommand(params));

    console.info(
      `Response from: ${event.path}, Success - item added or updated", ${data}`
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
        `An error occurred when try to put an item in the ${tableName} table in the database`,
        { cause: error }
      ),
    };

    return response;
  }
};
