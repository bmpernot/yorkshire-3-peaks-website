import { TextField, Typography, Box, FormControl, FormLabel } from "@mui/material";
import { styles } from "@/src/styles/event.mui.styles.mjs";
import { TeamMemberSection } from "../Event/EventSignUpForm.mjs";

function TeamInformation({ updatedTeam, setUpdatedTeam, canEdit, errors }) {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Team Management
      </Typography>

      <Typography variant="h4" sx={styles.title}>
        Team Registration
      </Typography>
      <Box sx={styles.box}>
        <Typography variant="body1" sx={styles.description} id="team-registration-information">
          • Teams must have <strong>3 - 5 members</strong> and must include yourself.
          <br />
          • Payment is managed on your profile page. Each member can contribute, but your team must meet or exceed the
          full amount.
          <br />
          • You can edit your team details anytime from your profile.
          <br />
          • All team members will have access to update the entry.
          <br />
          • Disabled users in the user search are ones that have already signed up to a team.
          <br />
        </Typography>
      </Box>
      <Box component="form">
        {errors.length > 0
          ? errors.map((error, index) => {
              return <ErrorCard error={error} index={index} />;
            })
          : null}
        <FormControl fullWidth sx={styles.form}>
          <FormLabel sx={styles.formLabel}>Team Name</FormLabel>
          <TextField
            disabled={canEdit}
            id="teamName"
            name="teamName"
            value={updatedTeam.teamName}
            onChange={(e) => setUpdatedTeam({ ...updatedTeam, teamName: e.target.value })}
            placeholder="Enter your team name"
            variant="outlined"
            size="medium"
          />
        </FormControl>

        <TeamMemberSection
          disabled={canEdit}
          formData={updatedTeam}
          setFormData={setUpdatedTeam}
          membersIndex={0}
          eventId={setUpdatedTeam.eventId}
        />
        <TeamMemberSection
          disabled={canEdit}
          formData={updatedTeam}
          setFormData={setUpdatedTeam}
          membersIndex={1}
          eventId={setUpdatedTeam.eventId}
        />
        <TeamMemberSection
          disabled={canEdit}
          formData={updatedTeam}
          setFormData={setUpdatedTeam}
          membersIndex={2}
          eventId={setUpdatedTeam.eventId}
        />
        {updatedTeam.members.length >= 3 ? (
          <TeamMemberSection
            disabled={canEdit}
            formData={updatedTeam}
            setFormData={setUpdatedTeam}
            membersIndex={3}
            eventId={setUpdatedTeam.eventId}
          />
        ) : null}
        {updatedTeam.members.length >= 4 ? (
          <TeamMemberSection
            disabled={canEdit}
            formData={updatedTeam}
            setFormData={setUpdatedTeam}
            membersIndex={4}
            eventId={setUpdatedTeam.eventId}
          />
        ) : null}
      </Box>
    </>
  );
}

export default TeamInformation;
