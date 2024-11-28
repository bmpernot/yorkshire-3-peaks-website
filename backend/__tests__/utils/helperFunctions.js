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
        { Name: "phone_number_verified", Value: i % 2 === 0 ? "true" : "false" },
      ],
      UserCreateDate: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
      UserLastModifiedDate: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
      Enabled: i % 2 === 0,
      UserStatus: i % 2 === 0 ? "CONFIRMED" : "UNCONFIRMED",
    });
  }

  return users;
}

function generateGetAllUsersEvent({ fields = "", userRole, eventOverrides }) {
  const event = {
    httpMethod: "GET",
    queryStringParameters: { fields },
    requestContext: {
      authorizer: {
        claims: {
          sub: "12345678-1234-1234-1234-123456789012", // Unique identifier for the user
          email: "user@example.com", // User's email address
          email_verified: "true", // Indicates if the user's email is verified
          "custom:ice_number": "01234567890", // Custom attribute for the user's role
          "custom:notify": "true", // Custom attribute for the user's role
          given_name: "John", // User's first name
          family_name: "Doe", // User's last name
          phone_number: "01234567890", // User's phone number
          phone_number_verified: "true", // Indicates if the user's phone number is verified
          aud: "client_id_abc123", // Cognito app client ID
          event_id: "a12bc34d-567e-89fa-bc12-3456789defgh", // Unique event ID
          token_use: "id", // Indicates the type of token (e.g., id or access)
          auth_time: "1700000000", // Timestamp when the user was authenticated
          exp: "1700100000", // Token expiration timestamp
          iss: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ABCDEFGHI", // Issuer of the token (Cognito user pool URL)
          iat: "1700000000", // Token issue timestamp
          username: "user@example.com", // Cognito username
        },
      },
    },
  };

  if (userRole) {
    event.requestContext.authorizer.claims["cognito:groups"] = userRole; // User's group (e.g., Admin, Organiser)
  }

  return { ...event, ...eventOverrides };
}

export { generateUsers, generateGetAllUsersEvent };
