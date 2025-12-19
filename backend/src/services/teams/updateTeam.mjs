import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "../../utils/infrastructureConfig.mjs";
import userSearchFunction from "../users/searchUser.mjs";
import getTeamsFunction from "../teams/getTeams.mjs";

const client = new DynamoDBClient(DynamoDBClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

const teamsTableName = process.env.TEAMS_TABLE_NAME || "TeamsTable";
const teamMembersTableName = process.env.TEAM_MEMBERS_TABLE_NAME || "TeamMembersTable";
const entriesTableName = process.env.ENTRIES_TABLE_NAME || "EntriesTable";

const updateTeamFunction = async (teamId, eventId, actions) => {
  if (!teamId || !eventId || !Array.isArray(actions) || actions.length === 0) {
    throw new Error("teamId, eventId and actions array are required");
  }

  const deleteAll = actions.some((action) => action.action === "delete" && action.type === "entry");

  if (deleteAll) {
    try {
      const membersData = await ddbDocClient.send(
        new QueryCommand({
          TableName: teamMembersTableName,
          IndexName: "EventIdIndex",
          KeyConditionExpression: "eventId = :eventId",
          FilterExpression: "#teamId = :teamId",
          ExpressionAttributeNames: {
            "#teamId": "teamId",
          },
          ExpressionAttributeValues: {
            ":teamId": teamId,
            ":eventId": eventId,
          },
        }),
      );

      const members = membersData.Items || [];

      const deletes = [
        {
          Delete: {
            TableName: teamsTableName,
            Key: { teamId },
          },
        },
        {
          Delete: {
            TableName: entriesTableName,
            Key: { teamId, eventId },
          },
        },
        ...members.map((member) => ({
          Delete: {
            TableName: teamMembersTableName,
            Key: { teamId, userId: member.userId },
          },
        })),
      ];

      await ddbDocClient.send(new TransactWriteCommand({ TransactItems: deletes }));

      return { action: "deleted", teamId, eventId };
    } catch (error) {
      throw new Error("failed to delete entry", { cause: error });
    }
  }

  const participatingUserIds = await userSearchFunction({ eventId });
  const team = await getTeamsFunction([teamId], []);
  const members = team[0].members;

  try {
    const transactItems = [];
    const validationErrors = [];

    for (const { action, type, newValues } of actions) {
      switch (type) {
        case "teamName":
          if (action === "modify") {
            if (
              !newValues.teamName ||
              typeof newValues.teamName !== "string" ||
              newValues.teamName.trim().length === 0
            ) {
              validationErrors.push("Team name is required");
              continue;
            }
            transactItems.push({
              Update: {
                TableName: teamsTableName,
                Key: { teamId },
                UpdateExpression: "SET teamName = :teamName",
                ExpressionAttributeValues: { ":teamName": newValues.teamName },
              },
            });
          }
          break;

        case "member":
          if (action === "add") {
            const alreadyParticipating = participatingUserIds.includes(newValues.userId);
            if (alreadyParticipating) {
              validationErrors.push("Unable to add a user who is already participating in the event");
              continue;
            }

            transactItems.push({
              Put: {
                TableName: teamMembersTableName,
                Item: {
                  teamId,
                  eventId,
                  userId: newValues.userId,
                  additionalRequirements: newValues.additionalRequirements || null,
                  willingToVolunteer: newValues.willingToVolunteer || false,
                },
              },
            });
          }

          if (action === "modify") {
            transactItems.push({
              Update: {
                TableName: teamMembersTableName,
                Key: { teamId, userId: newValues.userId },
                UpdateExpression:
                  "SET #additionalRequirements = :additionalRequirements, #willingToVolunteer = :willingToVolunteer",
                ExpressionAttributeValues: {
                  ":additionalRequirements": newValues.additionalRequirements ?? null,
                  ":willingToVolunteer": newValues.willingToVolunteer ?? false,
                },
                ExpressionAttributeNames: {
                  "#additionalRequirements": "additionalRequirements",
                  "#willingToVolunteer": "willingToVolunteer",
                },
              },
            });
          }

          if (action === "delete") {
            if (!members.map((member) => member.userId).includes(newValues.userId)) {
              validationErrors.push("To delete a member they must be a part of the team first");
              continue;
            }

            transactItems.push({
              Delete: {
                TableName: teamMembersTableName,
                Key: { teamId, userId: newValues.userId },
              },
            });
          }
          break;
      }
    }
    if (validationErrors.length !== 0) {
      return { action: "null", validationErrors };
    }

    if (transactItems.length === 0) {
      return { action: "null", teamId, eventId };
    }

    await ddbDocClient.send(new TransactWriteCommand({ TransactItems: transactItems }));

    return { action: "updated", teamId, eventId };
  } catch (error) {
    throw new Error("failed to update team", { cause: error });
  }
};

export default updateTeamFunction;
