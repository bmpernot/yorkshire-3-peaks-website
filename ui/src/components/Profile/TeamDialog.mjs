"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Divider } from "@mui/material";
import { styles } from "@/src/styles/event.mui.styles.mjs";
import Payment from "./Payment.mjs";
import TeamInformation from "./TeamInformation.mjs";
import { updateTeam } from "@/src/lib/backendActions.mjs";
import { toast } from "react-toastify";

function TeamDialog({ open, onClose, team, setTeams }) {
  const [updatedTeam, setUpdatedTeam] = useState(team);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const eventEnd = new Date(team.endDate);
  const eventHasEnded = useMemo(() => Date.now() >= eventEnd.getTime(), [team]);
  const canEdit = !eventHasEnded;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography sx={styles.mainTitle}>{team.teamName}</Typography>
      </DialogTitle>

      <DialogContent>
        <Payment
          teamId={team.teamId}
          eventId={team.eventId}
          cost={team.cost}
          paid={team.paid}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <Divider sx={{ my: 3 }} />
        <TeamInformation updatedTeam={updatedTeam} setUpdatedTeam={setUpdatedTeam} canEdit={canEdit} errors={errors} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => handleSaveTeamChanges({ team, updatedTeam, setTeams, setIsLoading, setErrors })}
          disabled={!canEdit}
        >
          Save Team Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

async function handleSaveTeamChanges({ team, updatedTeam, setTeams, setIsLoading, setErrors }) {
  try {
    setIsLoading("Updating team information");
    const actions = generateActions(team, updatedTeam);
    await updateTeam(actions);
    setTeams((teams) => {
      const index = teams.findIndex((t) => t.teamId === team.teamId);
      teams[index] = updatedTeam;
      return team;
    });
  } catch (error) {
    console.error("Failed to update teams information", { cause: error });
    toast.error("Failed to update teams information");
    setErrors("Failed to update teams information");
  } finally {
    setIsLoading(false);
  }
}

function generateActions(team, updatedTeam) {
  const actions = [];
  if (!updatedTeam) {
    actions.push({ action: "delete", type: "entry" });
    return actions;
  }

  if (team.teamName !== updatedTeam.teamName) {
    actions.push({ action: "modify", type: "teamName", newValue: updatedTeam.teamName });
  }

  team.members.forEach((member) => {
    if (!updatedTeam.members.map((member) => member.userId).includes(member.userId)) {
      actions.push({ action: "delete", type: "member", newValue: { userId: member.userId } });
    }
  });

  updatedTeam.members.forEach((updatedMember) => {
    const existingMember = team.members.find((existingMember) => existingMember.userId === updatedMember.userId);
    if (!existingMember) {
      actions.push({
        action: "add",
        type: "member",
        newValue: {
          userId: updatedMember.userId,
          additionalRequirements: updatedMember.additionalRequirements || null,
          willingToVolunteer: updatedMember.willingToVolunteer || false,
        },
      });
    } else {
      if (
        existingMember.additionalRequirements !== updatedMember.additionalRequirements ||
        existingMember.willingToVolunteer !== updatedMember.willingToVolunteer
      ) {
        actions.push({
          action: "modify",
          type: "member",
          newValue: {
            userId: updatedMember.userId,
            additionalRequirements: updatedMember.additionalRequirements || null,
            willingToVolunteer: updatedMember.willingToVolunteer || false,
          },
        });
      }
    }
  });

  return actions;
}

export default TeamDialog;
