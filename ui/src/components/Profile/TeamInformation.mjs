import {
  TextField,
  Typography,
  Box,
  FormControl,
  FormLabel,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { styles as eventStyles } from "@/src/styles/event.mui.styles.mjs";
import { styles as profileStyles } from "@/src/styles/profile.mui.styles.mjs";
import { useState, useMemo } from "react";
import { updateTeam } from "@/src/lib/backendActions.mjs";
import TeamRegistrationInformation from "../common/TeamRegistrationInformation.mjs";
import TeamMemberLookup from "../common/TeamMemberLookUp.mjs";
import { toast } from "react-toastify";
import generateActions from "./generateActions.mjs";
import DeleteTeamDialog from "./DeleteTeamDialog.mjs";
import ErrorCard from "../common/ErrorCard.mjs";
import { useUser } from "@/src/utils/userContext";

function TeamInformation({ team, setTeams, onClose }) {
  const { user } = useUser();
  const [updatedTeam, setUpdatedTeam] = useState(team);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const eventEnd = new Date(team.endDate);
  const eventHasEnded = useMemo(() => Date.now() >= eventEnd.getTime(), [team]);
  const canEdit = !eventHasEnded;

  async function handleSaveTeamChanges({ updatedTeam, deletingTeam = false }) {
    try {
      if (!deletingTeam && !(team.volunteer === "true")) {
        const errorsInFormData = validateFormData(updatedTeam);
        if (errorsInFormData.length > 0) {
          setErrors(errorsInFormData);
          return;
        }
      }

      setIsLoading(true);
      const actions = generateActions({ team, updatedTeam, deletingTeam });
      if (actions.length > 0) {
        const response = await updateTeam({ teamId: team.teamId, eventId: team.eventId, actions });
        // TODO - make an assessment on the usage and price on call to see if we can return the updated team back instead of modifying state locally
        if (response.validationErrors) {
          console.error("Failed to update teams information", { cause: response.validationErrors });
          toast.error("Failed to update teams information");
          setErrors(response.validationErrors);
          return;
        }
        if (deletingTeam) {
          setTeams((teams) => teams.filter((t) => t.teamId !== team.teamId));
          toast.success("Team Deleted");
        } else {
          const numberOfCurrentMembers = team.members.length;
          const numberOfMembers = updatedTeam.members.length;

          let cost = team.cost;

          if (numberOfCurrentMembers !== numberOfMembers) {
            const price = team.cost / numberOfCurrentMembers;
            cost = Math.round(price * numberOfMembers);
          }

          if (!updatedTeam.members.map((member) => member.userId).includes(user.id)) {
            setTeams((teams) => teams.filter((t) => t.teamId !== team.teamId));
          } else {
            setTeams((teams) => teams.map((t) => (t.teamId === team.teamId ? { ...updatedTeam, cost } : t)));
          }

          toast.success("Team Updated");
        }
      } else {
        toast.warn("Nothing to update");
      }
    } catch (error) {
      console.error("Failed to update teams information", { cause: error });
      toast.error("Failed to update teams information");
      setErrors(["Failed to update teams information"]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DialogContent>
        {canEdit ? (
          <>
            <Typography variant="h6" sx={profileStyles.marginBottom2}>
              Team Management
            </Typography>
            {team.volunteer === "false" && <TeamRegistrationInformation />}
          </>
        ) : null}
        <Box component="form">
          {errors.length > 0
            ? errors.map((error, index) => {
                return <ErrorCard error={error} index={index} key={`error-card-${index}`} />;
              })
            : null}
          <FormControl fullWidth sx={eventStyles.form}>
            <FormLabel sx={eventStyles.formLabel}>Team Name</FormLabel>
            <TextField
              disabled={!canEdit || team.volunteer === "true"}
              id="teamName"
              name="teamName"
              value={updatedTeam.teamName}
              onChange={(e) => setUpdatedTeam({ ...updatedTeam, teamName: e.target.value })}
              placeholder="Enter your team name"
              variant="outlined"
              size="medium"
            />
          </FormControl>

          {team.volunteer === "true" ? (
            team.members.map((member, index) => {
              return (
                <TeamMemberLookup
                  key={index}
                  disabled={!(member.userId === user.id)}
                  formData={updatedTeam}
                  setFormData={setUpdatedTeam}
                  membersIndex={index}
                  eventId={team.eventId}
                />
              );
            })
          ) : (
            <>
              <TeamMemberLookup
                disabled={!canEdit}
                formData={updatedTeam}
                setFormData={setUpdatedTeam}
                membersIndex={0}
                eventId={team.eventId}
              />
              <TeamMemberLookup
                disabled={!canEdit}
                formData={updatedTeam}
                setFormData={setUpdatedTeam}
                membersIndex={1}
                eventId={team.eventId}
              />
              <TeamMemberLookup
                disabled={!canEdit}
                formData={updatedTeam}
                setFormData={setUpdatedTeam}
                membersIndex={2}
                eventId={team.eventId}
              />
              {updatedTeam.members.length >= 3 && canEdit ? (
                <TeamMemberLookup
                  formData={updatedTeam}
                  setFormData={setUpdatedTeam}
                  membersIndex={3}
                  eventId={team.eventId}
                />
              ) : null}
              {updatedTeam.members.length >= 4 && canEdit ? (
                <TeamMemberLookup
                  formData={updatedTeam}
                  setFormData={setUpdatedTeam}
                  membersIndex={4}
                  eventId={team.eventId}
                />
              ) : null}
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {canEdit && (
          <>
            <Button
              variant="contained"
              onClick={() => handleSaveTeamChanges({ updatedTeam })}
              loading={isLoading}
              loadingPosition="end"
              id="save-team-changes"
            >
              Save Team Changes
            </Button>
            {team.volunteer === "false" && (
              <Button onClick={() => setDeleteOpen(true)} variant="outlined" color="error" id="delete-team">
                Delete Team
              </Button>
            )}
          </>
        )}
      </DialogActions>
      <DeleteTeamDialog
        open={deleteOpen}
        team={team}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          const teamWithDeletedAttributes = { ...team, teamName: null, members: [] };
          handleSaveTeamChanges({ updatedTeam: teamWithDeletedAttributes, deletingTeam: true });
        }}
        isLoading={isLoading}
      />
    </>
  );
}

function validateFormData(formData) {
  const messages = [];
  if (formData.members.length < 3 || formData.members.length > 5) {
    messages.push("Teams must have 3 to 5 members.");
  }

  const memberIds = formData.members.map((member) => member.userId);
  const allMembersAreUnique = new Set(memberIds).size === formData.members.length;
  if (!allMembersAreUnique) {
    messages.push("All team members must be unique.");
  }

  if (!formData.teamName.trim()) {
    messages.push("Team name is required.");
  }

  return messages;
}

export default TeamInformation;
