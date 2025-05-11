import getAllUsers from "../../src/handlers/users/getAllUsers.mjs";
import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { generateUsers, generateGetAllUsersEvent } from "../utils/helperFunctions";

describe("User functions", function () {
  const cognitoMock = mockClient(CognitoIdentityProviderClient);

  beforeEach(() => {
    cognitoMock.reset();
  });

  describe("Test getAllUsers", () => {
    it("Should return a list of ids", async () => {
      const users = generateUsers(1);

      cognitoMock.on(ListUsersCommand).resolves({
        Users: users,
      });

      const event = generateGetAllUsersEvent({});

      const response = await getAllUsers(event);

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body)).toEqual([
        {
          sub: "12345678-1234-1234-1234-123456789000",
          email: "user0@example.com",
        },
      ]);
    });

    it("Should be able to handle errors", async () => {
      const rejectedValue = new Error("Generic error");
      cognitoMock.on(ListUsersCommand).rejects(rejectedValue);

      const event = generateGetAllUsersEvent({});

      const response = await getAllUsers(event);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual("Failed to get all users");
    });

    it.each(["HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "POST", "PATCH", "CONNECT"])(
      "Should reject incorrect http methods: %s",
      async (httpMethod) => {
        const event = generateGetAllUsersEvent({
          eventOverrides: {
            httpMethod,
          },
        });

        const response = await getAllUsers(event);

        expect(response.statusCode).toEqual(405);
        expect(response.body).toEqual(`getAllUsers only accepts GET method, you tried: ${httpMethod}`);
      },
    );

    it.each(["Organiser", "Admin"])(
      "Should be able to pass in extra fields for the user object if you are an %s",
      async (userRole) => {
        const users = generateUsers(1);

        cognitoMock.on(ListUsersCommand).resolves({
          Users: users,
        });

        const event = generateGetAllUsersEvent({
          fields: "phone_number,given_name,family_name,email_verified,ice_number,custom:notify",
          userRole: userRole,
        });

        const response = await getAllUsers(event);

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
      const users = generateUsers(1);

      cognitoMock.on(ListUsersCommand).resolves({
        Users: users,
      });

      const event = generateGetAllUsersEvent({
        fields: "phone_number,given_name,family_name,email_verified,ice_number,custom:notify",
      });

      const response = await getAllUsers(event);

      expect(response.statusCode).toEqual(403);
      expect(response.body).toEqual("Unauthorized to get more fields");
    });

    it("Should be able to handle getting more than 200 users at a time", async () => {
      const totalUsers = 200;
      const usersBatch1 = generateUsers(60);
      const usersBatch2 = generateUsers(60, 60);
      const usersBatch3 = generateUsers(60, 120);
      const usersBatch4 = generateUsers(20, 180);

      cognitoMock
        .on(ListUsersCommand)
        .resolvesOnce({
          Users: usersBatch1,
          PaginationToken: "token1",
        })
        .resolvesOnce({
          Users: usersBatch2,
          PaginationToken: "token2",
        })
        .resolvesOnce({
          Users: usersBatch3,
          PaginationToken: "token3",
        })
        .resolvesOnce({
          Users: usersBatch4,
          PaginationToken: null,
        });
      const event = generateGetAllUsersEvent({});

      const response = await getAllUsers(event);

      expect(response.statusCode).toEqual(200);
      const responseBody = JSON.parse(response.body);
      expect(responseBody.length).toEqual(totalUsers);
      expect(responseBody[0]).toEqual({
        sub: "12345678-1234-1234-1234-123456789000",
        email: "user0@example.com",
      });
      expect(responseBody[199]).toEqual({
        sub: "12345678-1234-1234-1234-123456789199",
        email: "user199@example.com",
      });
    });
  });
});
