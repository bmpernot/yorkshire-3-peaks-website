function generateUsers(numberOfUsers, offset = 0) {
  const users = [];

  for (let i = offset; i < offset + numberOfUsers; i++) {
    users.push({
      Username: `12345678-1234-1234-1234-123456789${i.toString().padStart(3, "0")}`,
      Attributes: [
        { Name: "sub", Value: `12345678-1234-1234-1234-123456789${i.toString().padStart(3, "0")}` },
        { Name: "email", Value: `user${i}@example.com` },
        { Name: "email_verified", Value: i % 2 === 0 ? "true" : "false" },
        { Name: "given_name", Value: `Alice${i}` },
        { Name: "family_name", Value: `Smith${i}` },
        { Name: "custom:notify", Value: i % 2 === 0 ? "true" : "false" },
        { Name: "custom:ice_number", Value: `01234567${i.toString().padStart(3, "0")}` },
        { Name: "phone_number", Value: `01234567${i.toString().padStart(3, "0")}` },
      ],
      UserCreateDate: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
      UserLastModifiedDate: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
      Enabled: i % 2 === 0,
      UserStatus: i % 2 === 0 ? "CONFIRMED" : "UNCONFIRMED",
    });
  }

  return users;
}

function generateGetUsersEvent({ fields = "", userRole, eventOverrides }) {
  const event = {
    queryStringParameters: { fields },
    requestContext: {
      http: { method: "GET" },
      authorizer: {
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
      },
    },
  };

  if (userRole) {
    event.requestContext.authorizer.jwt.claims["cognito:groups"] = userRole;
  }

  return { ...event, ...eventOverrides };
}

export { generateUsers, generateGetUsersEvent };
