import getEntries from "../../src/handlers/events/getEntries.mjs";
import getEvents from "../../src/handlers/events/getEvents.mjs";
import { DynamoDBDocumentClient, ScanCommand, QueryCommand, BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { generateTeams, generateEvent, generateEntries, generateHttpApiEvent } from "../utils/helperFunctions";

describe("Event functions", () => {
  const dynamoDBMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    dynamoDBMock.reset();
  });

  describe("getEvents", () => {
    it("Should return a list of events", async () => {
      const mockEvents = generateEvent(3);

      dynamoDBMock.on(ScanCommand).resolves({
        Items: mockEvents,
      });

      const event = generateHttpApiEvent({});

      const result = await getEvents(event);
      expect(JSON.parse(result.body)).toEqual(mockEvents);
    });

    it("Should return an error if an error occurs during the lookup", async () => {
      dynamoDBMock.on(ScanCommand).rejects(new Error("DynamoDB error"));

      const event = generateHttpApiEvent({});

      const result = await getEvents(event);

      expect(result.body).toEqual("Failed to get events");
      expect(result.statusCode).toEqual(500);
    });
  });

  describe("getEntries", () => {
    it("Should return a list of entries with teamName", async () => {
      const mockTeams = generateTeams(2);
      const mockEntries = generateEntries("event-id-1", mockTeams);

      dynamoDBMock.on(QueryCommand).resolves({
        Items: mockEntries,
      });

      dynamoDBMock.on(BatchGetCommand).resolves({
        Responses: {
          TeamsTable: mockTeams,
        },
      });

      const event = generateHttpApiEvent({ queryStringParameters: { eventId: "event-id-1" } });

      const result = await getEntries(event);

      expect(JSON.parse(result.body)).toEqual(
        mockEntries.map((entry) => ({
          ...entry,
          teamName: mockTeams.find((t) => t.teamId === entry.teamId)?.teamName || null,
        })),
      );
    });

    it("Should return an error if no eventId is specified", async () => {
      const event = generateHttpApiEvent({});

      const result = await getEntries(event);

      expect(result.body).toEqual("getEntries requires a filter of eventId");
      expect(result.statusCode).toEqual(400);
    });

    it("Should return an error if an error occurs during the entries lookup", async () => {
      dynamoDBMock.on(QueryCommand).rejects(new Error("DynamoDB error"));

      const event = generateHttpApiEvent({ queryStringParameters: { eventId: "event-id-1" } });

      const result = await getEntries(event);

      expect(result.body).toEqual("Failed to get entries");
      expect(result.statusCode).toEqual(500);
    });

    it("Should return an error if an error occurs during the teams lookup", async () => {
      const mockTeams = generateTeams(1);
      const mockEntries = generateEntries("event-id-1", mockTeams);

      dynamoDBMock.on(QueryCommand).resolves({
        Items: mockEntries,
      });

      dynamoDBMock.on(BatchGetCommand).rejects(new Error("Teams lookup failed"));

      const event = generateHttpApiEvent({ queryStringParameters: { eventId: "event-id-1" } });

      const result = await getEntries(event);

      expect(result.body).toEqual("Failed to get entries");
      expect(result.statusCode).toEqual(500);
    });
  });
});
