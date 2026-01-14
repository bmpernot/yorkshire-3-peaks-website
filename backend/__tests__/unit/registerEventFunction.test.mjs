import registerEventFunction from "../../src/services/events/registerEvent.mjs";
import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";

const validEventData = {
  startDate: "2024-06-01T09:00:00.000Z",
  endDate: "2024-06-02T18:00:00.000Z",
  requiredWalkers: 100,
  requiredVolunteers: 10,
  earlyBirdPrice: 25,
  earlyBirdCutoff: "2024-05-01T23:59:59.000Z",
  price: 30,
};

describe("registerEventFunction", () => {
  const dynamoDBMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    dynamoDBMock.reset();
  });

  it("should successfully register an event", async () => {
    dynamoDBMock.on(TransactWriteCommand).resolves({});

    const result = await registerEventFunction(validEventData, "user-123");

    expect(result).toHaveProperty("eventId");
    expect(result.message).toBe("Event registered successfully");
    expect(typeof result.eventId).toBe("string");
  });

  it("should call DynamoDB with correct parameters", async () => {
    dynamoDBMock.on(TransactWriteCommand).resolves({});

    await registerEventFunction(validEventData, "user-123");

    expect(dynamoDBMock).toHaveReceivedCommandWith(TransactWriteCommand, {
      TransactItems: [
        {
          Put: {
            TableName: "EventsTable",
            Item: {
              eventId: expect.any(String),
              ...validEventData,
              createdBy: "user-123",
              createdAt: expect.any(String),
            },
          },
        },
        {
          Put: {
            TableName: "TeamsTable",
            Item: {
              teamId: expect.any(String),
              teamName: "Volunteers",
            },
          },
        },
        {
          Put: {
            TableName: "EntriesTable",
            Item: {
              eventId: expect.any(String),
              teamId: expect.any(String),
              volunteer: "true",
              cost: 0,
              paid: 0,
            },
          },
        },
      ],
    });
  });

  it("should generate unique eventIds for multiple calls", async () => {
    dynamoDBMock.on(TransactWriteCommand).resolves({});

    const result1 = await registerEventFunction(validEventData, "user-123");
    const result2 = await registerEventFunction(validEventData, "user-456");

    expect(result1.eventId).not.toBe(result2.eventId);
  });

  it("should throw error when DynamoDB fails", async () => {
    const dbError = new Error("DynamoDB error");
    dynamoDBMock.on(TransactWriteCommand).rejects(dbError);

    await expect(registerEventFunction(validEventData, "user-123")).rejects.toThrow("Failed to register event");
  });

  it("should preserve original error as cause", async () => {
    const dbError = new Error("DynamoDB error");
    dynamoDBMock.on(TransactWriteCommand).rejects(dbError);

    await expect(registerEventFunction(validEventData, "user-123")).rejects.toMatchObject({
      message: "Failed to register event",
      cause: dbError,
    });
  });

  it("should use default table name when environment variable not set", async () => {
    dynamoDBMock.on(TransactWriteCommand).resolves({});

    await registerEventFunction(validEventData, "user-123");

    expect(dynamoDBMock).toHaveReceivedCommandWith(TransactWriteCommand, {
      TransactItems: expect.any(Array),
    });
  });
});
