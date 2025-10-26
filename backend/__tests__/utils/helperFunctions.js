function generateUsers(numberOfUsers, offset = 0) {
  const users = [];

  for (let i = offset; i < offset + numberOfUsers; i++) {
    users.push({
      Username: `12345678-1234-1234-1234-123456789${i.toString().padStart(3, "0")}`,
      UserAttributes: [
        { Name: "sub", Value: `12345678-1234-1234-1234-123456789${i.toString().padStart(3, "0")}` },
        { Name: "email", Value: `user${i}@example.com` },
        { Name: "email_verified", Value: i % 2 === 0 ? "true" : "false" },
        { Name: "given_name", Value: `Alice${i}` },
        { Name: "family_name", Value: `Smith${i}` },
        { Name: "custom:notify", Value: i % 2 === 0 ? "true" : "false" },
        { Name: "custom:ice_number", Value: `01234567${i.toString().padStart(3, "0")}` },
        { Name: "phone_number", Value: `01234567${i.toString().padStart(3, "0")}` },
      ],
      UserCreateDate: new Date(Date.now() - i * 1000 * 60 * 60 * 24),
      UserLastModifiedDate: new Date(Date.now() - i * 1000 * 60 * 60),
      Enabled: i % 2 === 0,
      UserStatus: i % 2 === 0 ? "CONFIRMED" : "UNCONFIRMED",
    });
  }

  return users;
}

function generateTeams(numberOfTeams, offset = 0) {
  return Array.from({ length: numberOfTeams }, (_, i) => {
    const teamId = `team-id-${i + offset + 1}`;
    const teamName = `team-name-${i + offset + 1}`;
    return {
      teamId,
      teamName,
    };
  });
}

function generateEntries(eventId, teams, offset = 0) {
  return teams.map((team, i) => {
    const baseDate = new Date(Date.now() - i - offset * 1000 * 60 * 60 * 24);
    const checkpoints = [1, 2, 3, 4, 5, 6, 7].reduce((acc, idx) => {
      if (Math.random() > 0.8) {
        acc[`checkpoint${idx}`] = new Date(baseDate.valueOf() + 3600000 * idx + Math.random() * 1800000).toISOString();
      }
      return acc;
    }, {});

    return {
      eventId,
      teamId: team.teamId,
      cost: generateRandomNumber({ min: 10, max: 100 }),
      paid: generateRandomNumber({ min: 0, max: 1 }),
      start: baseDate.toISOString(),
      ...checkpoints,
      end: new Date(baseDate.valueOf() + 3600000 * 8 + Math.random() * 1800000).toISOString(),
    };
  });
}

function generateEvent(numberOfEvents, offset = 0) {
  return Array.from({ length: numberOfEvents }, (_, i) => {
    const eventId = `event-id-${i + offset + 1}`;
    const date = new Date(Date.now() - i - offset * 1000 * 60 * 60 * 24);
    const startDate = date.toISOString();
    const endDate = new Date(date.valueOf() + 172800000).toISOString();

    return {
      eventId,
      startDate: startDate,
      endDate: endDate,
      requiredWalkers: generateRandomNumber({ min: 10, max: 100 }),
      requiredVolunteers: generateRandomNumber({ min: 5, max: 50 }),
      earlyBirdPrice: generateRandomNumber({ min: 10, max: 30 }),
      earlyBirdCutoff: generateRandomNumber({ min: 7, max: 30 }),
      price: generateRandomNumber({ min: 40, max: 100 }),
    };
  });
}

function generateHttpApiEvent({
  queryStringParameters,
  method = "GET",
  userRole,
  eventOverrides,
  userSignedIn = true,
  body,
}) {
  const event = {
    queryStringParameters: queryStringParameters || {},
    requestContext: {
      http: { method },
    },
  };

  if (userSignedIn) {
    event.requestContext.authorizer = {
      jwt: {
        claims: {
          sub: "12345678-1234-1234-1234-123456789012",
          email: "user@example.com",
          email_verified: "true",
          "custom:ice_number": "01234567890",
          "custom:notify": "true",
          given_name: "John",
          family_name: "Doe",
          phone_number: "01234567890",
          aud: "client_id_abc123",
          event_id: "a12bc34d-567e-89fa-bc12-3456789defgh",
          token_use: "id",
          auth_time: "1700000000",
          exp: "1700100000",
          iss: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ABCDEFGHI",
          iat: "1700000000",
          username: "user@example.com",
        },
      },
    };

    if (userRole) {
      event.requestContext.authorizer.jwt.claims["cognito:groups"] = userRole;
    }

    if (body) {
      event.body = body;
    }
  }

  return { ...event, ...eventOverrides };
}

function generatePostCreateEvent({ eventOverrides }) {
  const event = {
    version: "1",
    triggerSource: "PostConfirmation_ConfirmSignUp",
    region: "eu-west-1",
    userPoolId: "eu-west-1_AbCdEfGHi",
    userName: "12345678-1234-1234-1234-123456789012",
    callerContext: {
      awsSdkVersion: "aws-sdk-js-3.0.0",
      clientId: "7gk4r1k9jvexample123",
    },
    request: {
      userAttributes: {
        sub: "12345678-1234-1234-1234-123456789012",
        email_verified: "true",
        "cognito:user_status": "CONFIRMED",
        email: "testuser@example.com",
        "custom:notify": "true",
        "custom:ice_number": "+441234567890",
        given_name: "John",
        family_name: "Doe",
      },
    },
    response: {},
  };

  return { ...event, ...eventOverrides };
}

function generateRandomNumber({ min, max }) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { generateUsers, generateHttpApiEvent, generatePostCreateEvent, generateTeams, generateEntries, generateEvent };
