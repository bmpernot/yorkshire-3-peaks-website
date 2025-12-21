import getTeams from "../../src/handlers/teams/getTeams.mjs";
import updateTeam from "../../src/handlers/teams/updateTeam.mjs";
import paymentIntent from "../../src/handlers/teams/paymentIntent.mjs";
import paymentSucceeded from "../../src/handlers/teams/paymentSucceeded.mjs";
import { DynamoDBDocumentClient, QueryCommand, BatchGetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { generateHttpApiEvent, generateUsers } from "../utils/helperFunctions";

describe("Team functions", () => {
  const dynamoDBMock = mockClient(DynamoDBDocumentClient);
  const cognitoMock = mockClient(CognitoIdentityProviderClient);

  beforeEach(() => {
    dynamoDBMock.reset();
    cognitoMock.reset();
  });

  describe("getTeams", () => {
    it("Should return user's teams information", async () => {
      dynamoDBMock
        .on(QueryCommand)
        .resolvesOnce({
          Items: [
            { teamId: "1", teamName: "team1" },
            { teamId: "2", teamName: "team2" },
          ],
        })
        .resolvesOnce({
          Items: [
            { teamId: "1", userId: "1", additionalRequirements: "qwerty", willingToVolunteer: true },
            { teamId: "1", userId: "2", additionalRequirements: "qwerty", willingToVolunteer: true },
          ],
        })
        .resolvesOnce({
          Items: [
            { teamId: "2", userId: "1", willingToVolunteer: false },
            { teamId: "2", userId: "2" },
            { teamId: "2", userId: "3", additionalRequirements: "qwerty", willingToVolunteer: true },
          ],
        })
        .resolvesOnce({
          Items: [{ teamId: "1", eventId: "1", volunteer: true, cost: 200, paid: 100 }],
        })
        .resolvesOnce({
          Items: [{ teamId: "2", eventId: "2", volunteer: false, cost: 120, paid: 80 }],
        });

      dynamoDBMock
        .on(BatchGetCommand)
        .resolvesOnce({
          Responses: {
            TeamsTable: [
              { teamId: "1", teamName: "team1" },
              { teamId: "2", teamName: "team2" },
            ],
          },
        })
        .resolvesOnce({
          Responses: {
            EventsTable: [
              { eventId: "1", startDate: new Date("2024-06-06 12:00"), endDate: new Date("2024-06-08 12:00") },
              { eventId: "2", startDate: new Date("2025-06-06 12:00"), endDate: new Date("2025-06-08 12:00") },
            ],
          },
        })
        .resolvesOnce({
          Responses: {
            UsersTable: [
              { userId: "1", firstName: "Ben1", lastName: "Pernot1", email: "yorkshirepeaks1@gmail.com" },
              { userId: "2", firstName: "Ben2", lastName: "Pernot2", email: "yorkshirepeaks2@gmail.com" },
              { userId: "3", firstName: "Ben3", lastName: "Pernot3", email: "yorkshirepeaks3@gmail.com" },
            ],
          },
        });

      const event = generateHttpApiEvent({});
      const response = await getTeams(event);

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body)).toEqual([
        {
          cost: 200,
          endDate: "2024-06-08T12:00:00.000Z",
          eventId: "1",
          paid: 100,
          startDate: "2024-06-06T12:00:00.000Z",
          teamId: "1",
          members: [
            {
              additionalRequirements: "qwerty",
              email: "yorkshirepeaks1@gmail.com",
              firstName: "Ben1",
              lastName: "Pernot1",
              userId: "1",
              willingToVolunteer: true,
            },
            {
              additionalRequirements: "qwerty",
              email: "yorkshirepeaks2@gmail.com",
              firstName: "Ben2",
              lastName: "Pernot2",
              userId: "2",
              willingToVolunteer: true,
            },
          ],
          teamName: "team1",
          volunteer: true,
        },
        {
          cost: 120,
          endDate: "2025-06-08T12:00:00.000Z",
          eventId: "2",
          paid: 80,
          startDate: "2025-06-06T12:00:00.000Z",
          teamId: "2",
          members: [
            {
              additionalRequirements: null,
              email: "yorkshirepeaks1@gmail.com",
              firstName: "Ben1",
              lastName: "Pernot1",
              userId: "1",
              willingToVolunteer: false,
            },
            {
              additionalRequirements: null,
              email: "yorkshirepeaks2@gmail.com",
              firstName: "Ben2",
              lastName: "Pernot2",
              userId: "2",
              willingToVolunteer: false,
            },
            {
              additionalRequirements: "qwerty",
              email: "yorkshirepeaks3@gmail.com",
              firstName: "Ben3",
              lastName: "Pernot3",
              userId: "3",
              willingToVolunteer: true,
            },
          ],
          teamName: "team2",
          volunteer: false,
        },
      ]);
    });

    it.each(["Organiser", "Admin"])(
      "Should be able to return teams information you are not apart of the team if you are an %s",
      async (userRole) => {
        const users = generateUsers(2);

        dynamoDBMock
          .on(QueryCommand)
          .resolvesOnce({
            Items: [
              { teamId: "1", userId: users[0].Username, additionalRequirements: "qwerty", willingToVolunteer: true },
              { teamId: "1", userId: users[1].Username, additionalRequirements: "qwerty", willingToVolunteer: true },
            ],
          })
          .resolvesOnce({
            Items: [
              { teamId: "2", userId: users[0].Username, willingToVolunteer: false },
              { teamId: "2", userId: users[1].Username },
            ],
          })
          .resolvesOnce({
            Items: [{ teamId: "1", eventId: "1", volunteer: true, cost: 200, paid: 100 }],
          })
          .resolvesOnce({
            Items: [{ teamId: "2", eventId: "2", volunteer: false, cost: 120, paid: 80 }],
          });

        dynamoDBMock
          .on(BatchGetCommand)
          .resolvesOnce({
            Responses: {
              TeamsTable: [
                { teamId: "1", teamName: "team1" },
                { teamId: "2", teamName: "team2" },
              ],
            },
          })
          .resolvesOnce({
            Responses: {
              EventsTable: [
                { eventId: "1", startDate: new Date("2024-06-06 12:00"), endDate: new Date("2024-06-08 12:00") },
                { eventId: "2", startDate: new Date("2025-06-06 12:00"), endDate: new Date("2025-06-08 12:00") },
              ],
            },
          });

        cognitoMock.on(AdminGetUserCommand).resolvesOnce(users[0]).resolvesOnce(users[1]);

        const event = generateHttpApiEvent({ queryStringParameters: { teamIds: "1,2" }, userRole });
        const response = await getTeams(event);

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.body)).toEqual([
          {
            cost: 200,
            endDate: "2024-06-08T12:00:00.000Z",
            eventId: "1",
            paid: 100,
            startDate: "2024-06-06T12:00:00.000Z",
            teamId: "1",
            members: [
              {
                additionalRequirements: "qwerty",
                email: "user0@example.com",
                firstName: "Alice0",
                iceNumber: "01234567000",
                lastName: "Smith0",
                number: "01234567000",
                userId: "12345678-1234-1234-1234-123456789000",
                willingToVolunteer: true,
              },
              {
                additionalRequirements: "qwerty",
                email: "user1@example.com",
                firstName: "Alice1",
                iceNumber: "01234567001",
                lastName: "Smith1",
                number: "01234567001",
                userId: "12345678-1234-1234-1234-123456789001",
                willingToVolunteer: true,
              },
            ],
            teamName: "team1",
            volunteer: true,
          },
          {
            cost: 120,
            endDate: "2025-06-08T12:00:00.000Z",
            eventId: "2",
            paid: 80,
            startDate: "2025-06-06T12:00:00.000Z",
            teamId: "2",
            members: [
              {
                additionalRequirements: null,
                email: "user0@example.com",
                firstName: "Alice0",
                iceNumber: "01234567000",
                lastName: "Smith0",
                number: "01234567000",
                userId: "12345678-1234-1234-1234-123456789000",
                willingToVolunteer: false,
              },
              {
                additionalRequirements: null,
                email: "user1@example.com",
                firstName: "Alice1",
                iceNumber: "01234567001",
                lastName: "Smith1",
                number: "01234567001",
                userId: "12345678-1234-1234-1234-123456789001",
                willingToVolunteer: false,
              },
            ],
            teamName: "team2",
            volunteer: false,
          },
        ]);
      },
    );

    it("Should return an error if something happens in the process of getting the teams information", async () => {
      dynamoDBMock.on(QueryCommand).rejects({ message: "failed to get users teams" });

      const event = generateHttpApiEvent({});
      const response = await getTeams(event);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual("Failed to get teams");
    });

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "POST", "PATCH", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateHttpApiEvent({
          eventOverrides: {
            requestContext: { http: { method: httpMethod } },
          },
        });

        const response = await getTeams(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`getTeams only accepts GET method, you tried: ${httpMethod}`);
      },
    );
  });

  describe("updateTeam", () => {
    it("Should be able to update the team based on the actions passed in the body", async () => {
      dynamoDBMock
        .on(QueryCommand)
        .resolvesOnce({
          Items: [{ teamId: "1", teamName: "team1" }],
        })
        .resolvesOnce({
          Items: [],
        })
        .resolvesOnce({
          Items: [
            { teamId: "1", userId: "1", additionalRequirements: "qwerty", willingToVolunteer: true },
            { teamId: "1", userId: "2", additionalRequirements: "qwerty", willingToVolunteer: true },
          ],
        })
        .resolvesOnce({
          Items: [{ teamId: "1", eventId: "1", volunteer: true, cost: 200, paid: 100 }],
        });

      dynamoDBMock
        .on(BatchGetCommand)
        .resolvesOnce({
          Responses: {
            TeamsTable: [{ teamId: "1", teamName: "team1" }],
          },
        })
        .resolvesOnce({
          Responses: {
            EventsTable: [
              { eventId: "1", startDate: new Date("2024-06-06 12:00"), endDate: new Date("2024-06-08 12:00") },
            ],
          },
        })
        .resolvesOnce({
          Responses: {
            UsersTable: [
              { userId: "1", firstName: "Ben1", lastName: "Pernot1", email: "yorkshirepeaks1@gmail.com" },
              { userId: "2", firstName: "Ben2", lastName: "Pernot2", email: "yorkshirepeaks2@gmail.com" },
            ],
          },
        });

      dynamoDBMock.on(TransactWriteCommand).resolves();
      const event = generateHttpApiEvent({
        method: "PATCH",
        queryStringParameters: { teamId: "1", eventId: "1" },
        body: {
          actions: [
            { action: "modify", type: "teamName", newValues: { teamName: "qwerty" } },
            {
              action: "add",
              type: "member",
              newValues: { userId: "7", additionalRequirements: "i am batman", willingToVolunteer: true },
            },
            {
              action: "modify",
              type: "member",
              newValues: { additionalRequirements: "no, i am batman", willingToVolunteer: false },
            },
            { action: "delete", type: "member", newValues: { userId: "1" } },
          ],
        },
      });
      const response = await updateTeam(event);

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body)).toEqual({ action: "updated", teamId: "1", eventId: "1" });
    });

    it("Should be able to delete the team entry based on the actions passed in the body", async () => {
      dynamoDBMock
        .on(QueryCommand)
        .resolvesOnce({ Items: [{ teamId: "1" }] })
        .resolvesOnce({ Items: [{ userId: "1" }] });

      dynamoDBMock.on(TransactWriteCommand).resolves();
      const event = generateHttpApiEvent({
        method: "PATCH",
        queryStringParameters: { teamId: "1", eventId: "1" },
        body: { actions: [{ action: "delete", type: "entry" }] },
      });
      const response = await updateTeam(event);

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body)).toEqual({ action: "deleted", teamId: "1", eventId: "1" });
    });

    it("Should not be able to update team information you are not apart of the team", async () => {
      dynamoDBMock.on(QueryCommand).resolves({ Items: [] });
      const event = generateHttpApiEvent({
        method: "PATCH",
        queryStringParameters: { teamId: "1", eventId: "1" },
        body: { actions: [] },
      });
      const response = await updateTeam(event);

      expect(response.statusCode).toEqual(403);
      expect(response.body).toEqual("Unauthorized to update teams you are not a part of");
    });

    it.each(["Organiser", "Admin"])(
      "Should be able to update team information you are not apart of the team if you are an %s",
      async (userRole) => {
        dynamoDBMock
          .on(QueryCommand)
          .resolvesOnce({
            Items: [],
          })
          .resolvesOnce({
            Items: [],
          })
          .resolvesOnce({
            Items: [
              { teamId: "1", userId: "1", additionalRequirements: "qwerty", willingToVolunteer: true },
              { teamId: "1", userId: "2", additionalRequirements: "qwerty", willingToVolunteer: true },
            ],
          })
          .resolvesOnce({
            Items: [{ teamId: "1", eventId: "1", volunteer: true, cost: 200, paid: 100 }],
          });

        dynamoDBMock
          .on(BatchGetCommand)
          .resolvesOnce({
            Responses: {
              TeamsTable: [{ teamId: "1", teamName: "team1" }],
            },
          })
          .resolvesOnce({
            Responses: {
              EventsTable: [
                { eventId: "1", startDate: new Date("2024-06-06 12:00"), endDate: new Date("2024-06-08 12:00") },
              ],
            },
          })
          .resolvesOnce({
            Responses: {
              UsersTable: [
                { userId: "1", firstName: "Ben1", lastName: "Pernot1", email: "yorkshirepeaks1@gmail.com" },
                { userId: "2", firstName: "Ben2", lastName: "Pernot2", email: "yorkshirepeaks2@gmail.com" },
              ],
            },
          });

        dynamoDBMock.on(TransactWriteCommand).resolves();
        const event = generateHttpApiEvent({
          method: "PATCH",
          queryStringParameters: { teamId: "1", eventId: "1" },
          userRole,
          body: {
            actions: [
              { action: "modify", type: "teamName", newValues: { teamName: "qwerty" } },
              {
                action: "add",
                type: "member",
                newValues: { userId: "1", additionalRequirements: "i am batman", willingToVolunteer: true },
              },
              {
                action: "modify",
                type: "member",
                newValues: { additionalRequirements: "no, i am batman", willingToVolunteer: false },
              },
              { action: "delete", type: "member", newValues: { userId: "1" } },
            ],
          },
        });
        const response = await updateTeam(event);

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.body)).toEqual({ action: "updated", teamId: "1", eventId: "1" });
      },
    );

    it("Should return validation errors if the actions will put the group in an incorrect state", async () => {
      dynamoDBMock
        .on(QueryCommand)
        .resolvesOnce({
          Items: [{ teamId: "1", teamName: "team1" }],
        })
        .resolvesOnce({
          Items: [{ userId: "1" }],
        })
        .resolvesOnce({
          Items: [
            { teamId: "1", userId: "1", additionalRequirements: "qwerty", willingToVolunteer: true },
            { teamId: "1", userId: "2", additionalRequirements: "qwerty", willingToVolunteer: true },
          ],
        })
        .resolvesOnce({
          Items: [{ teamId: "1", eventId: "1", volunteer: true, cost: 200, paid: 100 }],
        });

      dynamoDBMock
        .on(BatchGetCommand)
        .resolvesOnce({
          Responses: {
            TeamsTable: [{ teamId: "1", teamName: "team1" }],
          },
        })
        .resolvesOnce({
          Responses: {
            EventsTable: [
              { eventId: "1", startDate: new Date("2024-06-06 12:00"), endDate: new Date("2024-06-08 12:00") },
            ],
          },
        })
        .resolvesOnce({
          Responses: {
            UsersTable: [
              { userId: "1", firstName: "Ben1", lastName: "Pernot1", email: "yorkshirepeaks1@gmail.com" },
              { userId: "2", firstName: "Ben2", lastName: "Pernot2", email: "yorkshirepeaks2@gmail.com" },
            ],
          },
        });

      dynamoDBMock.on(TransactWriteCommand).resolves();
      const event = generateHttpApiEvent({
        method: "PATCH",
        queryStringParameters: { teamId: "1", eventId: "1" },
        body: {
          actions: [
            { action: "modify", type: "teamName", newValues: { teamName: "" } },
            {
              action: "add",
              type: "member",
              newValues: { userId: "1", additionalRequirements: "i am batman", willingToVolunteer: true },
            },
            {
              action: "modify",
              type: "member",
              newValues: { additionalRequirements: "no, i am batman", willingToVolunteer: false },
            },
            { action: "delete", type: "member", newValues: { userId: "3" } },
          ],
        },
      });
      const response = await updateTeam(event);

      expect(response.statusCode).toEqual(400);
      expect(JSON.parse(response.body)).toEqual({
        action: "null",
        validationErrors: [
          "Team name is required",
          "Unable to add a user who is already participating in the event",
          "To delete a member they must be a part of the team first",
        ],
      });
    });

    it("Should return an error if an error occurs during the update", async () => {
      dynamoDBMock.on(QueryCommand).rejects({ message: "failed" });
      const event = generateHttpApiEvent({
        method: "PATCH",
        queryStringParameters: { teamId: "1", eventId: "1" },
        body: { actions: [] },
      });
      const response = await updateTeam(event);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual("Failed to update teams");
    });

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "POST", "GET", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateHttpApiEvent({
          eventOverrides: {
            requestContext: { http: { method: httpMethod } },
          },
        });

        const response = await updateTeam(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`updateTeam only accepts PATCH method, you tried: ${httpMethod}`);
      },
    );
  });

  describe("paymentIntent", () => {
    it("Should return an error if an error occurs during the creation", async () => {
      const event = generateHttpApiEvent({
        method: "POST",
        body: JSON.stringify({ amount: 5000 }),
        queryStringParameters: { teamId: "1", eventId: "1", userId: "1" },
      });

      const result = await paymentIntent(event);

      expect(result.body).toEqual("Failed to create payment intent");
      expect(result.statusCode).toEqual(500);
    });

    it("Should require filters in order to functions", async () => {
      const event = generateHttpApiEvent({
        method: "POST",
        body: JSON.stringify({ amount: 5000 }),
      });

      const result = await paymentIntent(event);

      expect(result.body).toEqual("teamId, eventId and userId are required");
      expect(result.statusCode).toEqual(400);
    });

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "GET", "PATCH", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateHttpApiEvent({
          eventOverrides: {
            requestContext: { http: { method: httpMethod } },
          },
        });

        const response = await paymentIntent(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`paymentIntent only accepts POST method, you tried: ${httpMethod}`);
      },
    );
  });

  describe("paymentSucceeded", () => {
    it("Should return an error if an error occurs during the update", async () => {
      const event = generateHttpApiEvent({
        eventOverrides: {
          headers: { ["stripe-signature"]: "test stripe signature" },
        },
        method: "POST",
        body: "{}",
      });

      const result = await paymentSucceeded(event);

      expect(result.body).toEqual("Failed to process successful payment - please contact yorkshirepeaks@gmail.com");
      expect(result.statusCode).toEqual(500);
    });

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "GET", "PATCH", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateHttpApiEvent({
          eventOverrides: {
            requestContext: { http: { method: httpMethod } },
          },
        });

        const response = await paymentSucceeded(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`paymentSucceeded only accepts POST method, you tried: ${httpMethod}`);
      },
    );
  });
});
