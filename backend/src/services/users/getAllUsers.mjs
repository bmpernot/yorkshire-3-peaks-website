import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoIdentityProviderConfig } from "../../utils/infrastructureConfig.mjs";

const client = new CognitoIdentityProviderClient(CognitoIdentityProviderConfig);

const userPoolId = process.env.COGNITO_USER_POOL_ID;

const defaultFields = ["sub", "email"];

const cognitoDefaultAttributes = [
  "sub",
  "email",
  "phone_number",
  "given_name",
  "family_name",
  "email_verified",
  "phone_number_verified",
];

const getAllUsers = async (fields = []) => {
  let allUsers = [];
  let paginationToken;

  try {
    const mergedFields = Array.from(new Set([...fields, ...defaultFields]));
    const processedFields = ensureCustomPrefix(mergedFields, cognitoDefaultAttributes);

    do {
      const params = {
        UserPoolId: userPoolId,
        Limit: 60,
        AttributesToGet: processedFields,
        PaginationToken: paginationToken,
      };
      const data = await client.send(new ListUsersCommand(params));

      allUsers = [...allUsers, ...data.Users];
      paginationToken = data.PaginationToken;
    } while (paginationToken);

    const filteredUsers = allUsers.map((user) => {
      const attributes = {};
      user.Attributes.forEach((attribute) => {
        if (processedFields.includes(attribute.Name)) {
          attributes[attribute.Name] = attribute.Value;
        }
      });

      return attributes;
    });

    return filteredUsers;
  } catch (error) {
    throw new Error("An error occurred when trying to get all users from Cognito", { cause: error });
  }
};

export default getAllUsers;

function ensureCustomPrefix(fields, defaultFields) {
  return fields.map((field) => {
    if (defaultFields.includes(field) || field.startsWith("custom:")) {
      return field;
    }
    return `custom:${field}`;
  });
}
