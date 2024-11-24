import getAllUsers from "../../src/handlers/users/getAllUsers.mjs";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

describe("User functions", function () {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  describe("Test getAllUsers", () => {
    it("Should return a list of ids", async () => {
      const items = [{ id: "id1" }, { id: "id2" }];

      ddbMock.on(ScanCommand).resolves({
        Items: items,
      });

      const event = {
        httpMethod: "GET",
      };

      const response = await getAllUsers(event);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(items);
    });

    it("Should be able to handle errors", async () => {
      const rejectedValue = new Error("Generic error");
      ddbMock.on(ScanCommand).rejects(rejectedValue);

      const event = {
        httpMethod: "GET",
      };

      const response = await getAllUsers(event);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(new Error("An error occurred when tring to get all users"));
      expect(response.body.cause).toEqual(new Error("An error occurred when tring to get all users"));
      expect(response.body.cause.cause).toEqual(rejectedValue);
    });

    it("Should reject incorrect http methods", async () => {
      const event = {
        httpMethod: "POST",
      };

      const response = await getAllUsers(event);

      expect(response.statusCode).toEqual(405);
      expect(response.body).toEqual(new Error(`getAllUsers only accepts GET method, you tried: ${event.httpMethod}`));
    });
  });
});
