import { getAllItems } from "../../../src/handlers/get-all-items.mjs";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

describe("Test getAllItems", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  it("Should return a list of ids", async () => {
    const items = [{ id: "id1" }, { id: "id2" }];

    ddbMock.on(ScanCommand).resolves({
      Items: items,
    });

    const event = {
      httpMethod: "GET",
    };

    const response = await getAllItems(event);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(items);
  });

  it("Should be able to handle errors", async () => {
    const rejectedValue = new Error("Generic error");
    ddbMock.on(ScanCommand).rejects(rejectedValue);

    const event = {
      httpMethod: "GET",
    };

    const response = await getAllItems(event);

    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual(
      new Error("An error occurred when try to get all items")
    );
    expect(response.body.cause).toEqual(rejectedValue);
  });

  it("Should reject incorrect http methods", async () => {
    const event = {
      httpMethod: "POST",
    };

    const response = await getAllItems(event);

    expect(response.statusCode).toEqual(405);
    expect(response.body).toEqual(
      new Error(
        `getAllItems only accepts GET method, you tried: ${event.httpMethod}`
      )
    );
  });
});
