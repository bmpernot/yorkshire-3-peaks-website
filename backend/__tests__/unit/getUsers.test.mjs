import getUsers from "../../src/services/users/getUsers.mjs";

import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { generateUsers } from "../utils/helperFunctions";

describe("getUsers", () => {
  const cognitoMock = mockClient(CognitoIdentityProviderClient);

  beforeEach(() => {
    cognitoMock.reset();
  });

  it("Should return a list of users of the userIds passed in", async () => {
    const users = generateUsers(2);

    cognitoMock.on(AdminGetUserCommand).resolvesOnce(users[0]).resolvesOnce(users[1]);

    const response = await getUsers(
      "",
      users.map((user) => user.Username),
    );

    expect(response).toEqual([
      {
        sub: "12345678-1234-1234-1234-123456789000",
        email: "user0@example.com",
        given_name: `Alice0`,
        family_name: `Smith0`,
      },
      {
        sub: "12345678-1234-1234-1234-123456789001",
        email: "user1@example.com",
        given_name: `Alice1`,
        family_name: `Smith1`,
      },
    ]);
  });

  it("Should return a list of users of the userIds passed in with the extra fields passed in", async () => {
    const users = generateUsers(2);

    cognitoMock.on(AdminGetUserCommand).resolvesOnce(users[0]).resolvesOnce(users[1]);

    const response = await getUsers(
      "phone_number,given_name,family_name,email_verified,ice_number,custom:notify",
      users.map((user) => user.Username),
    );

    expect(response).toEqual([
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
      {
        "custom:ice_number": "01234567001",
        "custom:notify": "false",
        email: "user1@example.com",
        email_verified: "false",
        family_name: "Smith1",
        given_name: "Alice1",
        phone_number: "01234567001",
        sub: "12345678-1234-1234-1234-123456789001",
      },
    ]);
  });

  it("Should be able to handle errors", async () => {
    const users = generateUsers(2);

    const rejectedValue = new Error("Generic error");
    cognitoMock.on(AdminGetUserCommand).rejectsOnce(rejectedValue).resolvesOnce(users[1]);

    const response = await getUsers(
      "",
      users.map((user) => user.Username),
    );

    expect(response).toEqual([
      {
        sub: "12345678-1234-1234-1234-123456789001",
        email: "user1@example.com",
        given_name: `Alice1`,
        family_name: `Smith1`,
      },
    ]);
  });
});
