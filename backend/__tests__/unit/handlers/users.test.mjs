import {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../../../src/handlers/users.mjs";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

const tableName = process.env.USER_TABLE;

describe("User functions", function () {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  describe("Test addUser", function () {
    it("Should be able to add a user to the user table", async () => {
      const item = { id: "id1", name: "name1" };

      ddbMock.on(PutCommand).resolves({
        returnedItem: item,
      });

      const event = {
        httpMethod: "POST",
        body: { id: "id1", name: "name1" },
      };

      const response = await addUser(event);

      expect(response.statusCode).toEqual(201);
    });

    it("Should be able to handle errors", async () => {
      const rejectedValue = new Error("Generic error");
      ddbMock.on(PutCommand).rejects(rejectedValue);

      const event = {
        httpMethod: "POST",
        body: { id: "id1", name: "name1" },
      };

      const response = await addUser(event);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(
        new Error(`An error occurred when tring to add a user in ${tableName}`)
      );
      expect(response.body.cause).toEqual(rejectedValue);
    });

    it("Should reject incorrect http methods", async () => {
      const event = {
        httpMethod: "GET",
      };

      const response = await addUser(event);

      expect(response.statusCode).toEqual(405);
      expect(response.body).toEqual(
        new Error(
          `addUser only accepts POST method, you tried: ${event.httpMethod}`
        )
      );
    });
  });

  describe("Test getUserById", () => {
    it("Should get a specific item using id", async () => {
      const item = { id: "id1" };

      ddbMock.on(GetCommand).resolves({
        Item: item,
      });

      const event = {
        httpMethod: "GET",
        pathParameters: {
          id: "id1",
        },
      };

      const response = await getUserById(event);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(item);
    });

    it("Should be able to handle errors", async () => {
      const rejectedValue = new Error("Generic error");
      ddbMock.on(GetCommand).rejects(rejectedValue);

      const id = 1234567890;

      const event = {
        httpMethod: "GET",
        pathParameters: {
          id: id,
        },
      };

      const response = await getUserById(event);
      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(
        new Error(
          `An error occurred when tring to get the user with the id of: ${id}`
        )
      );
      expect(response.body.cause).toEqual(rejectedValue);
    });

    it("Should reject incorrect http methods", async () => {
      const event = {
        httpMethod: "POST",
      };

      const response = await getUserById(event);

      expect(response.statusCode).toEqual(405);
      expect(response.body).toEqual(
        new Error(
          `getUserById only accepts GET method, you tried: ${event.httpMethod}`
        )
      );
    });
  });

  describe("Test getAllUsers", () => {
    it("Should return a list of ids", async () => {
      const items = [{ id: "id1" }, { id: "id2" }];

      ddbMock.on(ScanCommand).resolves({
        Items: items,
      });

      const event = {
        httpMethod: "GET",
      };

      const response = await getAllUsers(event);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(items);
    });

    it("Should be able to handle errors", async () => {
      const rejectedValue = new Error("Generic error");
      ddbMock.on(ScanCommand).rejects(rejectedValue);

      const event = {
        httpMethod: "GET",
      };

      const response = await getAllUsers(event);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(
        new Error("An error occurred when tring to get all users")
      );
      expect(response.body.cause).toEqual(rejectedValue);
    });

    it("Should reject incorrect http methods", async () => {
      const event = {
        httpMethod: "POST",
      };

      const response = await getAllUsers(event);

      expect(response.statusCode).toEqual(405);
      expect(response.body).toEqual(
        new Error(
          `getAllUsers only accepts GET method, you tried: ${event.httpMethod}`
        )
      );
    });
  });

  describe("Test updateUser", () => {
    it("Should modify the user", async () => {
      const userObject = {
        id: 1,
        firstName: "Bruce",
        lastName: "Wayne",
        email: "bruce.wayne@waynecorp.com",
        number: "01234567890",
        iceNumber: "01234567891",
        role: "user",
      };

      ddbMock.on(UpdateCommand).resolves({
        Attributes: userObject,
      });

      const event = {
        httpMethod: "PUT",
        pathParameters: {
          id: "id1",
        },
        body: {
          firstName: "Bruce",
          lastName: "Wayne",
          email: "bruce.wayne@waynecorp.com",
          number: "01234567890",
          iceNumber: "01234567891",
          role: "user",
        },
      };

      const response = await updateUser(event);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(userObject);
    });

    it("Should not update a user if no usable fields are passed into the body", async () => {
      const event = {
        httpMethod: "PUT",
        pathParameters: {
          id: "id1",
        },
        body: {
          random: "value",
        },
      };

      const response = await updateUser(event);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual(
        new Error(`updateUser needs acceptable data for it to update the user`)
      );
    });

    it("Should be able to handle errors", async () => {
      const rejectedValue = new Error("Generic error");
      ddbMock.on(UpdateCommand).rejects(rejectedValue);

      const event = {
        httpMethod: "PUT",
        pathParameters: {
          id: "id1",
        },
        body: {
          firstName: "Bruce",
          lastName: "Wayne",
          email: "bruce.wayne@waynecorp.com",
          number: "01234567890",
          iceNumber: "01234567891",
          role: "user",
        },
      };

      const response = await updateUser(event);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(
        new Error(
          `An error occurred when tring to update a user in ${tableName}`
        )
      );
      expect(response.body.cause).toEqual(rejectedValue);
    });

    it("Should reject incorrect http methods", async () => {
      const event = {
        httpMethod: "POST",
      };

      const response = await updateUser(event);

      expect(response.statusCode).toEqual(405);
      expect(response.body).toEqual(
        new Error(
          `updateUser only accepts PUT method, you tried: ${event.httpMethod}`
        )
      );
    });
  });

  describe("Test deleteUser", () => {
    it("Should return a list of ids", async () => {
      ddbMock.on(DeleteCommand).resolves({});

      const id = 12345678;

      const event = {
        httpMethod: "DELETE",
        pathParameters: {
          id: id,
        },
      };

      const response = await deleteUser(event);

      expect(response.statusCode).toEqual(204);
    });

    it("Should be able to handle errors", async () => {
      const rejectedValue = new Error("Generic error");
      ddbMock.on(DeleteCommand).rejects(rejectedValue);

      const id = 12345678;

      const event = {
        httpMethod: "DELETE",
        pathParameters: {
          id: id,
        },
      };

      const response = await deleteUser(event);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual(
        new Error(`An error occurred when tring delete user with id: ${id}`)
      );
      expect(response.body.cause).toEqual(rejectedValue);
    });

    it("Should reject incorrect http methods", async () => {
      const event = {
        httpMethod: "GET",
      };

      const response = await deleteUser(event);

      expect(response.statusCode).toEqual(405);
      expect(response.body).toEqual(
        new Error(
          `deleteUser only accepts DELETE method, you tried: ${event.httpMethod}`
        )
      );
    });
  });
});
