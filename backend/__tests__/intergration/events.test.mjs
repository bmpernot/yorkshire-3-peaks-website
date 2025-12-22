import getEntries from "../../src/handlers/events/getEntries.mjs";
import getEvents from "../../src/handlers/events/getEvents.mjs";
import getEventInformation from "../../src/handlers/events/getEventInformation.mjs";
import registerTeam from "../../src/handlers/events/registerTeam.mjs";
import registerVolunteer from "../../src/handlers/events/registerVolunteer.mjs";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
  BatchGetCommand,
  GetCommand,
  TransactWriteCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { generateTeams, generateEvent, generateEntries, generateHttpApiEvent } from "../utils/helperFunctions";
import "aws-sdk-client-mock-jest";

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

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "POST", "PATCH", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateHttpApiEvent({
          eventOverrides: {
            requestContext: { http: { method: httpMethod } },
          },
        });

        const response = await getEvents(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`getEvents only accepts GET method, you tried: ${httpMethod}`);
      },
    );
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

      expect(result.statusCode).toEqual(200);
      expect(JSON.parse(result.body)).toEqual(
        mockEntries.map((entry) => ({
          ...entry,
          teamName: mockTeams.find((t) => t.teamId === entry.teamId)?.teamName || null,
          volunteer: false,
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

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "POST", "PATCH", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateHttpApiEvent({
          eventOverrides: {
            requestContext: { http: { method: httpMethod } },
          },
        });

        const response = await getEntries(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`getEntries only accepts GET method, you tried: ${httpMethod}`);
      },
    );
  });

  describe("getEventInformation", () => {
    it("Should return event information for an event", async () => {
      const mockEvent = generateEvent(1);

      const entriesData = [
        { teamId: 0, volunteer: String(false), paid: 160 },
        { teamId: 1, volunteer: String(false), paid: 200 },
        { teamId: 2, volunteer: String(true), paid: 0 },
      ];
      const membersData = [
        { teamId: 0 },
        { teamId: 0 },
        { teamId: 0 },
        { teamId: 1 },
        { teamId: 1 },
        { teamId: 1 },
        { teamId: 2 },
        { teamId: 2 },
        { teamId: 2 },
      ];

      dynamoDBMock.on(GetCommand).resolves({
        Item: mockEvent[0],
      });
      dynamoDBMock
        .on(QueryCommand)
        .resolvesOnce({
          Items: entriesData,
        })
        .resolvesOnce({
          Items: membersData,
        });

      const event = generateHttpApiEvent({ queryStringParameters: { eventId: mockEvent[0].eventId } });

      const result = await getEventInformation(event);
      expect(JSON.parse(result.body)).toEqual({
        endDate: mockEvent[0].endDate,
        eventId: mockEvent[0].eventId,
        moneyRaised: 360,
        currentVolunteers: 3,
        currentWalkers: 6,
        requiredVolunteers: mockEvent[0].requiredVolunteers,
        requiredWalkers: mockEvent[0].requiredWalkers,
        startDate: mockEvent[0].startDate,
      });
    });

    it("Should not accept no eventId", async () => {
      const event = generateHttpApiEvent({});

      const result = await getEventInformation(event);

      expect(result.body).toEqual("getEventInformation requires a filter of eventId");
      expect(result.statusCode).toEqual(400);
    });

    it("Should return an error if an error occurs during the lookup", async () => {
      const genericError = new Error("DynamoDB error");
      dynamoDBMock.on(GetCommand).rejects(genericError);
      dynamoDBMock.on(QueryCommand).rejects(genericError);

      const event = generateHttpApiEvent({ queryStringParameters: { eventId: "example" } });

      const result = await getEventInformation(event);

      expect(result.statusCode).toEqual(500);
      expect(result.body).toEqual("Failed to get event information, eventId: example");
    });

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "POST", "PATCH", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateHttpApiEvent({
          eventOverrides: {
            requestContext: { http: { method: httpMethod } },
          },
        });

        const response = await getEventInformation(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`getEventInformation only accepts GET method, you tried: ${httpMethod}`);
      },
    );
  });

  describe("registerTeam", () => {
    it("Should return a list of entries with teamName", async () => {
      const mockEvent = generateEvent(1);

      dynamoDBMock.on(QueryCommand).resolves({
        Items: [],
      });
      dynamoDBMock.on(GetCommand).resolves({
        Item: mockEvent[0],
      });

      const members = [
        { userId: "12345678-1234-1234-1234-123456789011", additionalRequirements: "1", willingToVolunteer: true },
        { userId: "12345678-1234-1234-1234-123456789012", additionalRequirements: "2", willingToVolunteer: true },
        { userId: "12345678-1234-1234-1234-123456789013", additionalRequirements: "3", willingToVolunteer: false },
        { userId: "12345678-1234-1234-1234-123456789014", additionalRequirements: "4", willingToVolunteer: false },
        { userId: "12345678-1234-1234-1234-123456789015", additionalRequirements: "5", willingToVolunteer: true },
      ];

      const event = generateHttpApiEvent({
        queryStringParameters: { eventId: mockEvent[0].eventId },
        method: "POST",
        body: {
          teamName: "example",
          members,
        },
      });

      const response = await registerTeam(event);

      expect(response).toEqual({ statusCode: 201 });
      expect(dynamoDBMock).toHaveReceivedCommandTimes(TransactWriteCommand, 1);
    });

    it("Should validate the team information before entry", async () => {
      const mockEvent = generateEvent(1);

      dynamoDBMock.on(QueryCommand).resolves({
        Items: [{ userId: "12345678-1234-1234-1234-123456789011" }],
      });

      const teamName = "example";
      const members = [
        { userId: "12345678-1234-1234-1234-123456789011", additionalRequirements: "1", willingToVolunteer: true },
        { userId: "12345678-1234-1234-1234-123456789012", additionalRequirements: "2", willingToVolunteer: true },
        { userId: "12345678-1234-1234-1234-123456789013", additionalRequirements: "3", willingToVolunteer: false },
        { userId: "12345678-1234-1234-1234-123456789013", additionalRequirements: "3", willingToVolunteer: false },
      ];

      const event1 = generateHttpApiEvent({
        queryStringParameters: { eventId: mockEvent[0].eventId },
        method: "POST",
        body: {},
      });

      const event2 = generateHttpApiEvent({
        queryStringParameters: { eventId: mockEvent[0].eventId },
        method: "POST",
        body: { teamName, members: [] },
      });

      const event3 = generateHttpApiEvent({
        queryStringParameters: { eventId: mockEvent[0].eventId },
        method: "POST",
        body: { teamName, members },
      });

      const [response1, response2, response3] = await Promise.all([
        await registerTeam(event1),
        await registerTeam(event2),
        await registerTeam(event3),
      ]);

      expect(response1.statusCode).toEqual(400);
      expect(JSON.parse(response1.body)).toEqual({ errors: ["Team name is required", "Members must be an array"] });

      expect(response2.statusCode).toEqual(400);
      expect(JSON.parse(response2.body)).toEqual({
        errors: ["Team must have between 3 and 5 members", "The user submitting the request must be part of the team"],
      });

      expect(response3.statusCode).toEqual(400);
      expect(JSON.parse(response3.body)).toEqual({
        errors: [
          "Duplicate members are not allowed in a team",
          "The following users are already participating in this event: 12345678-1234-1234-1234-123456789011",
        ],
      });
    });

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "GET", "PATCH", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateHttpApiEvent({
          eventOverrides: {
            requestContext: { http: { method: httpMethod } },
          },
        });

        const response = await registerTeam(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`registerTeam only accepts POST method, you tried: ${httpMethod}`);
      },
    );
  });

  describe("registerVolunteer", () => {
    it("Should allow a user to register as a volunteer", async () => {
      dynamoDBMock
        .on(QueryCommand)
        .resolvesOnce({
          Items: [],
        })
        .resolvesOnce({
          Items: [{ teamId: 1 }],
        });

      const event = generateHttpApiEvent({ queryStringParameters: { eventId: 1 }, method: "POST" });

      const response = await registerVolunteer(event);
      expect(response).toEqual({ statusCode: 201 });
      expect(dynamoDBMock).toHaveReceivedCommandTimes(PutCommand, 1);
    });

    it("Should validate the member before entry", async () => {
      dynamoDBMock
        .on(QueryCommand)
        .resolvesOnce({
          Items: [{ teamId: 1 }],
        })
        .resolvesOnce({
          Items: [],
        })
        .resolvesOnce({
          Items: [],
        });

      const event = generateHttpApiEvent({ queryStringParameters: { eventId: 1 }, method: "POST" });

      const [response1, response2] = await Promise.all([
        await registerVolunteer(event),
        await registerVolunteer(event),
      ]);

      expect(response1).toEqual({ statusCode: 500, body: "Failed to register volunteer" });
      expect(response2).toEqual({ statusCode: 500, body: "Failed to register volunteer" });
    });

    it("Should not allow entry without an eventId", async () => {
      const event = generateHttpApiEvent({ method: "POST" });

      const response = await registerVolunteer(event);
      expect(response).toEqual({ statusCode: 400, body: "registerVolunteer requires a filter of eventId" });
    });

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "GET", "PATCH", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateHttpApiEvent({
          eventOverrides: {
            requestContext: { http: { method: httpMethod } },
          },
        });

        const response = await registerVolunteer(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`registerVolunteer only accepts POST method, you tried: ${httpMethod}`);
      },
    );
  });
});
