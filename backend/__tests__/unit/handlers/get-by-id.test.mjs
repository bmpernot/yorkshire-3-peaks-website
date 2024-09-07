import { getById } from "../../../src/handlers/get-by-id.mjs";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

describe("Test getById", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  it("Should get a specific item using id", async () => {
    const item = { id: "id1" };

    ddbMock.on(GetCommand).resolves({
      Item: item,
    });

    const event = {
      httpMethod: "GET",
      pathParameters: {
        id: "id1",
      },
    };

    const response = await getById(event);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(item);
  });

  it("Should be able to handle errors", async () => {
    const rejectedValue = new Error("Generic error");
    ddbMock.on(GetCommand).rejects(rejectedValue);

    const event = {
      httpMethod: "GET",
      pathParameters: {
        id: "id1",
      },
    };

    const response = await getById(event);
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual(
      new Error(
        "An error occurred when try to get the item with the id of: id1"
      )
    );
    expect(response.body.cause).toEqual(rejectedValue);
  });

  it("Should reject incorrect http methods", async () => {
    const event = {
      httpMethod: "POST",
    };

    const response = await getById(event);

    expect(response.statusCode).toEqual(405);
    expect(response.body).toEqual(
      new Error(
        `getById only accepts GET method, you tried: ${event.httpMethod}`
      )
    );
  });
});
