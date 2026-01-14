import { jest } from "@jest/globals";

const mockRegisterEventFunction = jest.fn();

jest.unstable_mockModule("../../src/services/events/registerEvent.mjs", () => ({
  default: mockRegisterEventFunction,
}));

const { default: registerEvent } = await import("../../src/handlers/events/registerEvent.mjs");

const validEventData = {
  startDate: "2024-06-01T09:00:00.000Z",
  endDate: "2024-06-02T18:00:00.000Z",
  requiredWalkers: 100,
  requiredVolunteers: 10,
  earlyBirdPrice: 25,
  earlyBirdCutoff: "2024-05-01T23:59:59.000Z",
  price: 30,
};

const createEvent = (method = "POST", groups = ["Admin"], body = validEventData) => ({
  requestContext: {
    http: { method },
    authorizer: {
      jwt: {
        claims: {
          sub: "user-123",
          "cognito:groups": groups,
        },
      },
    },
  },
  body: JSON.stringify(body),
});

describe("registerEvent", () => {
  beforeEach(() => {
    mockRegisterEventFunction.mockClear();
  });

  describe("HTTP method validation", () => {
    it("should return 405 for non-POST methods", async () => {
      const response = await registerEvent(createEvent("GET"));

      expect(response.statusCode).toBe(405);
      expect(response.body).toContain("registerEvent only accepts POST method");
    });
  });

  describe("Authorization", () => {
    it("should return 403 for users without Admin or Organiser group", async () => {
      const response = await registerEvent(createEvent("POST", []));

      expect(response.statusCode).toBe(403);
      expect(response.body).toBe("Only Admin or Organiser users can create events");
    });

    it("should return 403 when cognito:groups is undefined", async () => {
      const event = {
        requestContext: {
          http: { method: "POST" },
          authorizer: {
            jwt: {
              claims: {
                sub: "user-123",
              },
            },
          },
        },
        body: JSON.stringify(validEventData),
      };

      const response = await registerEvent(event);

      expect(response.statusCode).toBe(403);
      expect(response.body).toBe("Only Admin or Organiser users can create events");
    });

    it("should allow Admin users to create events", async () => {
      mockRegisterEventFunction.mockResolvedValue({ eventId: "event-123", message: "Event registered successfully" });

      const response = await registerEvent(createEvent("POST", ["Admin"]));

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toEqual({ eventId: "event-123", message: "Event registered successfully" });
    });

    it("should allow Organiser users to create events", async () => {
      mockRegisterEventFunction.mockResolvedValue({ eventId: "event-456", message: "Event registered successfully" });

      const response = await registerEvent(createEvent("POST", ["Organiser"]));

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toEqual({ eventId: "event-456", message: "Event registered successfully" });
    });

    it("should allow users with both Admin and Organiser groups", async () => {
      mockRegisterEventFunction.mockResolvedValue({ eventId: "event-789", message: "Event registered successfully" });

      const response = await registerEvent(createEvent("POST", ["Admin", "Organiser"]));

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toEqual({ eventId: "event-789", message: "Event registered successfully" });
    });

    it("should return 403 for users with other groups", async () => {
      const response = await registerEvent(createEvent("POST", ["User", "Guest"]));

      expect(response.statusCode).toBe(403);
      expect(response.body).toBe("Only Admin or Organiser users can create events");
    });
  });

  describe("Validation", () => {
    it("should return 400 for invalid JSON", async () => {
      const event = createEvent("POST", ["Admin"]);
      event.body = "invalid json";

      const response = await registerEvent(event);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors).toContain("Invalid JSON in request body");
    });

    it("should accept body as JSON string", async () => {
      mockRegisterEventFunction.mockResolvedValue({ eventId: "event-123", message: "Event registered successfully" });

      const response = await registerEvent(createEvent("POST", ["Admin"], validEventData));

      expect(response.statusCode).toBe(201);
      expect(mockRegisterEventFunction).toHaveBeenCalledWith(validEventData, "user-123");
    });

    it("should accept body as object", async () => {
      mockRegisterEventFunction.mockResolvedValue({ eventId: "event-456", message: "Event registered successfully" });
      const event = createEvent("POST", ["Admin"]);
      event.body = validEventData;

      const response = await registerEvent(event);

      expect(response.statusCode).toBe(201);
      expect(mockRegisterEventFunction).toHaveBeenCalledWith(validEventData, "user-123");
    });

    it("should handle null body gracefully", async () => {
      const event = createEvent("POST", ["Admin"]);
      event.body = null;

      const response = await registerEvent(event);

      expect(response.statusCode).toBe(400);
      const errors = JSON.parse(response.body).errors;
      expect(errors).toContain("Valid startDate is required");
      expect(errors).toContain("Valid endDate is required");
    });

    it("should handle undefined body gracefully", async () => {
      const event = createEvent("POST", ["Admin"]);
      event.body = undefined;

      const response = await registerEvent(event);

      expect(response.statusCode).toBe(400);
      const errors = JSON.parse(response.body).errors;
      expect(errors).toContain("Valid startDate is required");
      expect(errors).toContain("Valid endDate is required");
    });

    it("should return 400 for missing startDate", async () => {
      const response = await registerEvent(createEvent("POST", ["Admin"], { ...validEventData, startDate: undefined }));

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors).toContain("Valid startDate is required");
    });

    it("should return 400 for invalid endDate", async () => {
      const response = await registerEvent(
        createEvent("POST", ["Admin"], { ...validEventData, endDate: "invalid-date" }),
      );

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors).toContain("Valid endDate is required");
    });

    it("should return 400 when endDate is before startDate", async () => {
      const response = await registerEvent(
        createEvent("POST", ["Admin"], {
          ...validEventData,
          startDate: "2024-06-02T09:00:00.000Z",
          endDate: "2024-06-01T18:00:00.000Z",
        }),
      );

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors).toContain("endDate must be after startDate");
    });

    it("should return 400 for invalid requiredWalkers", async () => {
      const response = await registerEvent(createEvent("POST", ["Admin"], { ...validEventData, requiredWalkers: -5 }));

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors).toContain("requiredWalkers must be a positive integer");
    });

    it("should return 400 for invalid requiredVolunteers", async () => {
      const response = await registerEvent(
        createEvent("POST", ["Admin"], { ...validEventData, requiredVolunteers: -1 }),
      );

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors).toContain("requiredVolunteers must be a non-negative integer");
    });

    it("should return 400 for invalid earlyBirdPrice", async () => {
      const response = await registerEvent(createEvent("POST", ["Admin"], { ...validEventData, earlyBirdPrice: 0 }));

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors).toContain("earlyBirdPrice must be a positive integer");
    });

    it("should return 400 for invalid price", async () => {
      const response = await registerEvent(
        createEvent("POST", ["Admin"], { ...validEventData, price: "not-a-number" }),
      );

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).errors).toContain("price must be a positive integer");
    });
  });

  describe("Error handling", () => {
    it("should return 500 when registerEventFunction throws an error", async () => {
      mockRegisterEventFunction.mockRejectedValue(new Error("Database error"));

      const response = await registerEvent(createEvent("POST", ["Admin"]));

      expect(response.statusCode).toBe(500);
      expect(response.body).toBe("Failed to register event");
    });
  });

  describe("Success case", () => {
    it("should successfully create event with valid data", async () => {
      mockRegisterEventFunction.mockResolvedValue({ eventId: "event-789", message: "Event registered successfully" });

      const response = await registerEvent(createEvent("POST", ["Admin"]));

      expect(response.statusCode).toBe(201);
      expect(mockRegisterEventFunction).toHaveBeenCalledWith(validEventData, "user-123");
    });
  });
});
