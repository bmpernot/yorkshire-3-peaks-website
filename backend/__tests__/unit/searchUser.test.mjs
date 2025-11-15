import searchUser from "../../src/services/users/searchUser.mjs";
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { generateUsers } from "../utils/helperFunctions";

describe("searchUser", () => {
  const dynamoDBMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    dynamoDBMock.reset();
  });

  it("Should return a list of userIds that match the searchTerm", async () => {
    const users = generateUsers(1);

    dynamoDBMock.on(ScanCommand).resolves({ Items: [{ userId: users[0].Username }] });

    const response = await searchUser({ searchTerm: "example" });

    expect(response).toEqual(["12345678-1234-1234-1234-123456789000"]);
  });

  it("Should return a list of userIds that are in the event with the eventId passed in", async () => {
    const users = generateUsers(1);

    dynamoDBMock.on(QueryCommand).resolves({ Items: [{ userId: users[0].Username }] });

    const response = await searchUser({ eventId: "example" });

    expect(response).toEqual(["12345678-1234-1234-1234-123456789000"]);
  });

  it("Should return a list of userIds that both match the searchTerm and are in the event with eventId", async () => {
    const users = generateUsers(3);

    dynamoDBMock.on(QueryCommand).resolves({ Items: [{ userId: users[0].Username }, { userId: users[2].Username }] });
    dynamoDBMock.on(ScanCommand).resolves({ Items: [{ userId: users[1].Username }, { userId: users[2].Username }] });

    const response = await searchUser({ eventId: "example", searchTerm: "example" });

    expect(response).toEqual(["12345678-1234-1234-1234-123456789002"]);
  });

  it("Should be able to handle errors", async () => {
    const rejectedValue = new Error("Generic error");
    dynamoDBMock.on(QueryCommand).rejects(rejectedValue);
    dynamoDBMock.on(ScanCommand).rejects(rejectedValue);

    let response;
    try {
      await searchUser({ eventId: "example", searchTerm: "example" });
    } catch (error) {
      response = error;
    }

    expect(response).toEqual(new Error("Failed to search users from DynamoDB"));
  });

  it("Should return [] if no users match the search criteria", async () => {
    dynamoDBMock.on(QueryCommand).resolves({ Items: [] });
    dynamoDBMock.on(ScanCommand).resolves({ Items: [] });

    const response = await searchUser({ eventId: "example", searchTerm: "example" });

    expect(response).toEqual([]);
  });

  it("Should return [] if no search criteria is passed in", async () => {
    const response = await searchUser({});

    expect(response).toEqual([]);
  });
});
