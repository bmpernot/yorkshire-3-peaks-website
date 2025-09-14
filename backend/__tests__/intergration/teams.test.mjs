import getTeams from "../../src/handlers/teams/getTeams.mjs";
import { DynamoDBDocumentClient, BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { generateTeams, generateHttpApiEvent } from "../utils/helperFunctions";

describe("Team functions", () => {
  const dynamoDBMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    dynamoDBMock.reset();
  });

  describe("getTeams", () => {
    it("Should return team information when a single team id is passed", async () => {
      const mockTeams = generateTeams(1);
      const teamId = mockTeams[0].teamId;

      const event = generateHttpApiEvent({ queryStringParameters: { teamIds: teamId } });

      dynamoDBMock.on(BatchGetCommand).resolves({
        Responses: { TeamsTable: mockTeams },
      });

      const result = await getTeams(event);

      expect(JSON.parse(result.body)).toEqual(mockTeams);
      expect(dynamoDBMock.calls().length).toBe(1);
    });

    it("Should return team information when multiple team ids are passed", async () => {
      const mockTeams = generateTeams(3);
      const teamIds = mockTeams.map((t) => t.teamId).join(",");

      const event = generateHttpApiEvent({ queryStringParameters: { teamIds } });

      dynamoDBMock.on(BatchGetCommand).resolves({
        Responses: { TeamsTable: mockTeams },
      });

      const result = await getTeams(event);

      expect(JSON.parse(result.body)).toEqual(mockTeams);
      expect(JSON.parse(result.body)).toHaveLength(3);
    });

    it("Should throw an error if no team ids are passed in", async () => {
      const event = generateHttpApiEvent({});

      const result = await getTeams(event);

      expect(result.body).toEqual("getTeams requires a filter of teamIds");
      expect(result.statusCode).toEqual(400);
    });

    it("Should throw an error if an error occurs during the lookup", async () => {
      const mockTeams = generateTeams(1);
      const teamId = mockTeams[0].teamId;

      const event = generateHttpApiEvent({ queryStringParameters: { teamIds: teamId } });

      dynamoDBMock.on(BatchGetCommand).rejects(new Error("DynamoDB failure"));

      const result = await getTeams(event);

      expect(result.body).toEqual("Failed to get teams");
      expect(result.statusCode).toEqual(500);
    });
  });
});

// TODO - make tests
