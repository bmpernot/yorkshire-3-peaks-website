import getUsers from "../../src/handlers/users/getUsers.mjs";
import insertUser from "../../src/handlers/users/insertUser.mjs";
import updateUser from "../../src/handlers/users/updateUser.mjs";
import deleteUser from "../../src/handlers/users/deleteUser.mjs";

import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { generateUsers, generateHttpApiEvent, generatePostCreateEvent } from "../utils/helperFunctions";

describe("User functions", () => {
  const cognitoMock = mockClient(CognitoIdentityProviderClient);
  const dynamoDBMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    cognitoMock.reset();
    dynamoDBMock.reset();
  });

  describe("getUsers", () => {
    it("Should return a users information that match the search criteria", async () => {
      const users = generateUsers(1);

      dynamoDBMock.on(QueryCommand).resolves({ Items: [{ userId: users[0].Username }] });
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

      const event = generateHttpApiEvent({ queryStringParameters: { searchTerm: "example", eventId: "example" } });

      const response = await getUsers(event);

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body)).toEqual([
        {
          userId: "12345678-1234-1234-1234-123456789000",
          email: "user0@example.com",
          firstName: `Alice0`,
          lastName: `Smith0`,
          searchValue: "alice0 smith0 user0@example.com",
          alreadyParticipating: true,
        },
      ]);
    });

    it("Should be able to handle errors", async () => {
      const rejectedValue = new Error("Generic error");
      dynamoDBMock.on(QueryCommand).rejects(rejectedValue);
      dynamoDBMock.on(ScanCommand).rejects(rejectedValue);
      cognitoMock.on(AdminGetUserCommand).rejects(rejectedValue);

      const event = generateHttpApiEvent({ queryStringParameters: { searchTerm: "example", eventId: "example" } });

      const response = await getUsers(event);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual("Failed to get users");
    });

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "POST", "PATCH", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateHttpApiEvent({
          eventOverrides: {
            requestContext: { http: { method: httpMethod } },
          },
        });

        const response = await getUsers(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`getUsers only accepts GET method, you tried: ${httpMethod}`);
      },
    );

    it.each(["Organiser", "Admin"])(
      "Should be able to pass in extra fields for the user object if you are an %s",
      async (userRole) => {
        const users = generateUsers(1);

        dynamoDBMock.on(QueryCommand).resolves({ Items: [{ userId: users[0].Username }] });
        dynamoDBMock.on(ScanCommand).resolves({ Items: [{ userId: users[0].Username }] });

        cognitoMock.on(AdminGetUserCommand).resolves(users[0]);

        const event = generateHttpApiEvent({
          queryStringParameters: {
            fields: "phone_number,given_name,family_name,email_verified,ice_number,custom:notify",
            searchTerm: "example",
            eventId: "example",
          },
          userRole,
        });

        const response = await getUsers(event);

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.body)).toEqual([
          {
            "custom:ice_number": "01234567000",
            "custom:notify": "true",
            email: "user0@example.com",
            email_verified: "true",
            family_name: "Smith0",
            given_name: "Alice0",
            phone_number: "01234567000",
            sub: "12345678-1234-1234-1234-123456789000",
          },
        ]);
      },
    );

    it("Should not be able to pass in extra fields for the user object if you are not an admin", async () => {
      const event = generateHttpApiEvent({
        queryStringParameters: {
          fields: "phone_number,given_name,family_name,email_verified,ice_number,custom:notify",
        },
      });

      const response = await getUsers(event);

      expect(response.statusCode).toEqual(403);
      expect(response.body).toEqual("Unauthorized to get more fields");
    });

    it("Should return [] if no users match the search criteria", async () => {
      dynamoDBMock.on(QueryCommand).resolves([]);
      dynamoDBMock.on(ScanCommand).resolves([]);

      const event = generateHttpApiEvent({});

      const response = await getUsers(event);

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body)).toEqual([]);
    });

    it("Should return [] if no search criteria is passed in", async () => {
      const event = generateHttpApiEvent({});

      const response = await getUsers(event);

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body)).toEqual([]);
    });
  });

  describe("insertUsers", () => {
    it("Should be able to insert a user", async () => {
      const users = generateUsers(1);

      dynamoDBMock.on(PutCommand).resolves({
        ...users[0],
      });

      const event = generatePostCreateEvent({});

      const response = await insertUser(event);

      expect(response).toEqual(event);
    });

    it("Should be able to handle an error gracefully", async () => {
      dynamoDBMock.on(PutCommand).rejects("failed to insert user");

      const event = generatePostCreateEvent({});

      const response = await insertUser(event);

      expect(response).toEqual(event);
    });
  });

  describe("updatedUsers", () => {
    it("should be able to update a user info", async () => {
      const users = generateUsers(1);

      dynamoDBMock.on(UpdateCommand).resolves({
        ...users[0],
      });

      const event = generateHttpApiEvent({
        body: {
          userId: "12345678-1234-1234-1234-123456789012",
          firstName: "bruce",
          lastName: "wayne",
          email: "bruce.wayne@yorkshirepeaks.com",
        },
        method: "PATCH",
      });

      const response = await updateUser(event);

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body)).toEqual({ success: true, userId: "12345678-1234-1234-1234-123456789012" });
    });

    it("should not allow an user to update another users info", async () => {
      const users = generateUsers(1);

      dynamoDBMock.on(UpdateCommand).resolves({
        ...users[0],
      });

      const event = generateHttpApiEvent({
        body: {
          userId: "12345678-1234-1234-1234-123456789000",
          firstName: "bruce",
          lastName: "wayne",
          email: "bruce.wayne@yorkshirepeaks.com",
        },
        method: "PATCH",
      });

      const response = await updateUser(event);

      expect(response.statusCode).toEqual(403);
      expect(response.body).toEqual("Unauthorized to update someone else profile");
    });

    it.each(["Organiser", "Admin"])(
      "should allow an admin or organiser to update another users info",
      async (userRole) => {
        const users = generateUsers(1);

        dynamoDBMock.on(UpdateCommand).resolves({
          ...users[0],
        });

        const event = generateHttpApiEvent({
          body: {
            userId: "12345678-1234-1234-1234-123456789000",
            firstName: "bruce",
            lastName: "wayne",
            email: "bruce.wayne@yorkshirepeaks.com",
          },
          method: "PATCH",
          userRole,
        });

        const response = await updateUser(event);

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.body)).toEqual({ success: true, userId: "12345678-1234-1234-1234-123456789000" });
      },
    );

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "POST", "GET", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateHttpApiEvent({
          eventOverrides: {
            requestContext: { http: { method: httpMethod } },
          },
        });

        const response = await updateUser(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`updateUser only accepts PATCH method, you tried: ${httpMethod}`);
      },
    );

    it("Should be able to handle errors", async () => {
      const rejectedValue = new Error("Generic error");
      dynamoDBMock.on(UpdateCommand).rejects(rejectedValue);

      const event = generateHttpApiEvent({
        body: {
          userId: "12345678-1234-1234-1234-123456789012",
          firstName: "bruce",
          lastName: "wayne",
          email: "bruce.wayne@yorkshirepeaks.com",
        },
        method: "PATCH",
      });

      const response = await updateUser(event);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual("Failed to update users");
    });
  });

  describe("deleteUsers", () => {
    it("should be able to delete a user info", async () => {
      dynamoDBMock.on(DeleteCommand).resolves();

      const event = generateHttpApiEvent({
        queryStringParameters: {
          userId: "12345678-1234-1234-1234-123456789012",
        },
        method: "DELETE",
      });

      const response = await deleteUser(event);

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body)).toEqual({ success: true, userId: "12345678-1234-1234-1234-123456789012" });
    });

    it("should not allow an user to delete another users info", async () => {
      const event = generateHttpApiEvent({
        queryStringParameters: {
          userId: "12345678-1234-1234-1234-123456789000",
        },
        method: "DELETE",
      });

      const response = await deleteUser(event);

      expect(response.statusCode).toEqual(403);
      expect(response.body).toEqual("Unauthorized to delete another user");
    });

    it("should allow an admin to update another users info", async () => {
      dynamoDBMock.on(UpdateCommand).resolves();

      const event = generateHttpApiEvent({
        queryStringParameters: {
          userId: "12345678-1234-1234-1234-123456789000",
        },
        method: "DELETE",
        userRole: "Admin",
      });

      const response = await deleteUser(event);

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body)).toEqual({ success: true, userId: "12345678-1234-1234-1234-123456789000" });
    });

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "PATCH", "POST", "GET", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateHttpApiEvent({
          eventOverrides: {
            requestContext: { http: { method: httpMethod } },
          },
        });

        const response = await deleteUser(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`deleteUser only accepts DELETE method, you tried: ${httpMethod}`);
      },
    );

    it("Should be able to handle errors", async () => {
      const rejectedValue = new Error("Generic error");
      dynamoDBMock.on(DeleteCommand).rejects(rejectedValue);

      const event = generateHttpApiEvent({
        queryStringParameters: {
          userId: "12345678-1234-1234-1234-123456789012",
        },
        method: "DELETE",
      });

      const response = await deleteUser(event);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual("Failed to delete users");
    });
  });
});
