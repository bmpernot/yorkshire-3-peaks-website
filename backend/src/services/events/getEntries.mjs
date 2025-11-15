import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";
import getTeamsFunction from "../teams/getTeams.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const entriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";

const getEntriesFunction = async (eventId) => {
  const allEntries = await getEntriesForEventId(eventId);

  const teamIds = extractUniqueTeamIds(allEntries);

  if (teamIds.length === 0) {
    return allEntries;
  }

  const teamNameMap = await getTeamNamesForTeamIds(teamIds);

  const enrichedEntries = enrichEntries(allEntries, teamNameMap);

  return enrichedEntries;
};

export default getEntriesFunction;

async function getEntriesForEventId(eventId) {
  const allEntries = [];
  let lastEvaluatedKey;

  try {
    do {
      const params = {
        TableName: entriesTableName,
        KeyConditionExpression: "eventId = :eventId",
        ExpressionAttributeValues: {
          ":eventId": eventId,
        },
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const data = await ddbDocClient.send(new QueryCommand(params));
      if (data.Items) {
        allEntries.push(...data.Items);
      }

      lastEvaluatedKey = data.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return allEntries;
  } catch (error) {
    throw new Error("Failed to get entries", { cause: error });
  }
}

function extractUniqueTeamIds(allEntries) {
  return [...new Set(allEntries.map((entry) => entry.teamId))];
}

async function getTeamNamesForTeamIds(teamIds) {
  try {
    const teams = await getTeamsFunction(teamIds);
    const teamNameMap = new Map(teams.map((team) => [team.teamId, team.teamName]));
    return teamNameMap;
  } catch (error) {
    throw new Error("Failed to get team names", { cause: error });
  }
}

function enrichEntries(allEntries, teamNameMap) {
  return allEntries.map((entry) => ({
    ...entry,
    teamName: teamNameMap.get(entry.teamId) || null,
    volunteer: entry.volunteer ? entry.volunteer === "true" : false,
  }));
}
