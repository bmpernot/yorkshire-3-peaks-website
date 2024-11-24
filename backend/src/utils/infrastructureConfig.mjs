const DynamoDBClientConfig = process.env.AWS_SAM_LOCAL
  ? {
      endpoint: "http://dynamodb-local:8000",
      region: "local",
    }
  : { region: process.env.AWS_REGION || "eu-west-2" };

const CognitoIdentityProviderConfig = process.env.AWS_SAM_LOCAL
  ? {
      endpoint: "http://dynamodb-local:8000",
      region: "local",
    }
  : { region: process.env.AWS_REGION || "eu-west-2" };

export { DynamoDBClientConfig, CognitoIdentityProviderConfig };
