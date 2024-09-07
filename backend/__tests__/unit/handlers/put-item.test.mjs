import { putItem } from "../../../src/handlers/put-item.mjs";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

const tableName = process.env.SAMPLE_TABLE;

describe("Test putItem", function () {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  it("Should be able to add a row of data to the table", async () => {
    const item = { id: "id1", name: "name1" };

    ddbMock.on(PutCommand).resolves({
      returnedItem: item,
    });

    const event = {
      httpMethod: "POST",
      body: '{"id": "id1","name": "name1"}',
    };

    const response = await putItem(event);

    expect(response.statusCode).toEqual(201);
  });

  it("Should be able to handle errors", async () => {
    const rejectedValue = new Error("Generic error");
    ddbMock.on(PutCommand).rejects(rejectedValue);

    const event = {
      httpMethod: "POST",
      body: '{"id": "id1","name": "name1"}',
    };

    const response = await putItem(event);
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual(
      new Error(
        `An error occurred when try to put an item in the ${tableName} table in the database`
      )
    );
    expect(response.body.cause).toEqual(rejectedValue);
  });

  it("Should reject incorrect http methods", async () => {
    const event = {
      httpMethod: "GET",
    };

    const response = await putItem(event);

    expect(response.statusCode).toEqual(405);
    expect(response.body).toEqual(
      new Error(
        `putItem only accepts POST method, you tried: ${event.httpMethod}`
      )
    );
  });
});
