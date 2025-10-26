import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoIdentityProviderConfig } from "../../utils/infrastructureConfig.mjs";

const client = new CognitoIdentityProviderClient(CognitoIdentityProviderConfig);

const userPoolId = process.env.COGNITO_USER_POOL_NAME;

const defaultFields = ["sub", "given_name", "family_name", "email"];
const cognitoDefaultAttributes = ["sub", "email", "phone_number", "given_name", "family_name", "email_verified"];

const getUsers = async (fieldsString = "", userIds = []) => {
  if (userIds.length === 0) {
    return [];
  }

  try {
    const fields = fieldsString.length > 0 ? fieldsString.split(",") : [];
    const mergedFields = Array.from(new Set([...fields, ...defaultFields]));
    const processedFields = ensureCustomPrefix(mergedFields, cognitoDefaultAttributes);

    const results = await Promise.all(
      userIds.map(async (userId) => {
        try {
          const data = await client.send(
            new AdminGetUserCommand({
              UserPoolId: userPoolId,
              Username: userId,
            }),
          );

          const attributes = {};
          data.UserAttributes.forEach((attr) => {
            if (processedFields.includes(attr.Name)) {
              attributes[attr.Name] = attr.Value;
            }
          });
          return attributes;
        } catch (error) {
          console.warn(`⚠️ Skipping user ${userId}: ${error.message}`);
          return null;
        }
      }),
    );

    return results.filter(Boolean);
  } catch (error) {
    throw new Error("An error occurred when trying to get users from Cognito", { cause: error });
  }
};

export default getUsers;

function ensureCustomPrefix(fields, defaultFields) {
  return fields.map((field) => {
    if (defaultFields.includes(field) || field.startsWith("custom:")) {
      return field;
    }
    return `custom:${field}`;
  });
}
