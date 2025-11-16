import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";

const ddbClient = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const usersTableName = process.env.USERS_TABLE_NAME || "UsersTable";
const teamMembersTableName = process.env.TEAM_MEMBERS_TABLE_NAME || "TeamMembersTable";

const userSearch = async ({ eventId, searchTerm }) => {
  try {
    let users;
    const usersMatchingCriteria = {};

    if (eventId && eventId.length > 0) {
      const teamMembersData = await ddbDocClient.send(
        new QueryCommand({
          TableName: teamMembersTableName,
          IndexName: "EventIdIndex",
          KeyConditionExpression: "eventId = :eventId",
          ExpressionAttributeValues: { ":eventId": eventId },
          ProjectionExpression: "userId",
        }),
      );

      const participatingUserIds = new Set((teamMembersData.Items || []).map((e) => e.userId));
      usersMatchingCriteria.eventIdSet = participatingUserIds;
    }

    if (searchTerm && searchTerm.length > 0) {
      const userData = await ddbDocClient.send(
        new ScanCommand({
          TableName: usersTableName,
          FilterExpression: "contains(searchValue, :searchTerm)",
          ExpressionAttributeValues: {
            ":searchTerm": searchTerm,
          },
        }),
      );

      users = userData.Items || [];

      const usersMatchingSearchTerm = new Set(users.map((e) => e.userId));
      usersMatchingCriteria.searchTermSet = usersMatchingSearchTerm;
    }

    const { eventIdSet, searchTermSet } = usersMatchingCriteria;

    if (!eventIdSet && !searchTermSet) {
      return [];
    } else if (eventIdSet && !searchTermSet) {
      return [...eventIdSet];
    } else if (!eventIdSet && searchTermSet) {
      return users;
    } else {
      const usersAlreadyParticipating = searchTermSet.intersection(eventIdSet);

      return users.map((user) => ({
        ...user,
        alreadyParticipating: usersAlreadyParticipating.has(user.userId),
      }));
    }
  } catch (error) {
    throw new Error("Failed to search users from DynamoDB", { cause: error });
  }
};

export default userSearch;
