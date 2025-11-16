import searchUser from "../../src/services/users/searchUser.mjs";
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { generateUsers } from "../utils/helperFunctions";

describe("searchUser", () => {
  const dynamoDBMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    dynamoDBMock.reset();
  });

  it("Should return a users information that match the searchTerm", async () => {
    const users = generateUsers(1);

    dynamoDBMock.on(ScanCommand).resolves({
      Items: [
        {
          userId: users[0].Username,
          firstName: users[0].UserAttributes[3].Value,
          lastName: users[0].UserAttributes[4].Value,
          email: users[0].UserAttributes[1].Value,
          searchValue: `${users[0].UserAttributes[3].Value.toLowerCase()} ${users[0].UserAttributes[4].Value.toLowerCase()} ${users[0].UserAttributes[1].Value.toLowerCase()}`,
        },
      ],
    });

    const response = await searchUser({ searchTerm: "example" });

    expect(response).toEqual([
      {
        email: "user0@example.com",
        firstName: "Alice0",
        lastName: "Smith0",
        searchValue: "alice0 smith0 user0@example.com",
        userId: "12345678-1234-1234-1234-123456789000",
      },
    ]);
  });

  it("Should return a list of userIds that are in the event with the eventId passed in", async () => {
    const users = generateUsers(1);

    dynamoDBMock.on(QueryCommand).resolves({
      Items: [
        {
          userId: users[0].Username,
          firstName: users[0].UserAttributes[3].Value,
          lastName: users[0].UserAttributes[4].Value,
          email: users[0].UserAttributes[1].Value,
          searchValue: `${users[0].UserAttributes[3].Value.toLowerCase()} ${users[0].UserAttributes[4].Value.toLowerCase()} ${users[0].UserAttributes[1].Value.toLowerCase()}`,
        },
      ],
    });

    const response = await searchUser({ eventId: "example" });

    expect(response).toEqual(["12345678-1234-1234-1234-123456789000"]);
  });

  it("Should return a users information that both match the searchTerm and specify if they are already participating in the event", async () => {
    const users = generateUsers(3);

    dynamoDBMock.on(QueryCommand).resolves({
      Items: [
        {
          userId: users[0].Username,
          firstName: users[0].UserAttributes[3].Value,
          lastName: users[0].UserAttributes[4].Value,
          email: users[0].UserAttributes[1].Value,
          searchValue: `${users[0].UserAttributes[3].Value.toLowerCase()} ${users[0].UserAttributes[4].Value.toLowerCase()} ${users[0].UserAttributes[1].Value.toLowerCase()}`,
        },
        {
          userId: users[2].Username,
          firstName: users[2].UserAttributes[3].Value,
          lastName: users[2].UserAttributes[4].Value,
          email: users[2].UserAttributes[1].Value,
          searchValue: `${users[2].UserAttributes[3].Value.toLowerCase()} ${users[2].UserAttributes[4].Value.toLowerCase()} ${users[2].UserAttributes[1].Value.toLowerCase()}`,
        },
      ],
    });
    dynamoDBMock.on(ScanCommand).resolves({
      Items: [
        {
          userId: users[1].Username,
          firstName: users[1].UserAttributes[3].Value,
          lastName: users[1].UserAttributes[4].Value,
          email: users[1].UserAttributes[1].Value,
          searchValue: `${users[1].UserAttributes[3].Value.toLowerCase()} ${users[1].UserAttributes[4].Value.toLowerCase()} ${users[1].UserAttributes[1].Value.toLowerCase()}`,
        },
        {
          userId: users[2].Username,
          firstName: users[2].UserAttributes[3].Value,
          lastName: users[2].UserAttributes[4].Value,
          email: users[2].UserAttributes[1].Value,
          searchValue: `${users[2].UserAttributes[3].Value.toLowerCase()} ${users[2].UserAttributes[4].Value.toLowerCase()} ${users[2].UserAttributes[1].Value.toLowerCase()}`,
        },
      ],
    });

    const response = await searchUser({ eventId: "example", searchTerm: "example" });

    expect(response).toEqual([
      {
        alreadyParticipating: false,
        email: "user1@example.com",
        firstName: "Alice1",
        lastName: "Smith1",
        searchValue: "alice1 smith1 user1@example.com",
        userId: "12345678-1234-1234-1234-123456789001",
      },
      {
        alreadyParticipating: true,
        email: "user2@example.com",
        firstName: "Alice2",
        lastName: "Smith2",
        searchValue: "alice2 smith2 user2@example.com",
        userId: "12345678-1234-1234-1234-123456789002",
      },
    ]);
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
