import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  endpoint: "http://localhost:8000",
  region: "local",
});

async function createTable(params) {
  try {
    const command = new CreateTableCommand(params);
    const data = await client.send(command);
    console.log("Table created:", data);
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

async function generateTables(tableDocuments) {
  for (const tableDocument of tableDocuments) {
    await createTable(tableDocument);
  }
}

const tableDocuments = [
  {
    TableName: "UserTable",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 2,
      WriteCapacityUnits: 2,
    },
  },
];

await generateTables(tableDocuments);
