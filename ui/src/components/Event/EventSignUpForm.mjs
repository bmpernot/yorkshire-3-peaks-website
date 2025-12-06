import { useState } from "react";
import { Typography, FormControl, FormLabel, TextField, Button, Box } from "@mui/material";
import { StyledCard, StyledContainer as SignUpContainer } from "../common/CustomComponents.mjs";
import { toast } from "react-toastify";
import ErrorCard from "../common/ErrorCard.mjs";
import { styles } from "@/src/styles/event.mui.styles.mjs";
import { registerTeam } from "@/src/lib/backendActions.mjs";
import TeamRegistrationInformation from "../common/TeamRegistrationInformation.mjs";
import TeamMemberLookup from "../common/TeamMemberLookUp.mjs";

function EventSignUpForm({ eventId, router, isLoggedIn, user }) {
  const [formData, setFormData] = useState({
    teamName: "",
    members: [],
  });
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorsInFormData = validateFormData(formData, user);
    if (errorsInFormData.length > 0) {
      setErrors(errorsInFormData);
      return;
    }

    try {
      await registerTeam({ eventId, formData });

      toast.success("Successfully registered team");

      router.push(`/user/profile`);
    } catch {
      toast.error("Failed to register team.");
    }
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between" paddingTop="true">
      <StyledCard variant="outlined" sx={styles.card} nomaxwidth="true">
        <Typography variant="h4" sx={styles.title}>
          Team Registration
        </Typography>
        <TeamRegistrationInformation />
        {isLoggedIn ? (
          <Box component="form" onSubmit={handleSubmit}>
            {errors.length > 0
              ? errors.map((error, index) => {
                  return <ErrorCard error={error} index={index} />;
                })
              : null}
            <FormControl fullWidth sx={styles.form}>
              <FormLabel sx={styles.formLabel}>Team Name</FormLabel>
              <TextField
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="Enter your team name"
                variant="outlined"
                size="medium"
              />
            </FormControl>

            <TeamMemberLookup formData={formData} setFormData={setFormData} membersIndex={0} eventId={eventId} />
            <TeamMemberLookup formData={formData} setFormData={setFormData} membersIndex={1} eventId={eventId} />
            <TeamMemberLookup formData={formData} setFormData={setFormData} membersIndex={2} eventId={eventId} />
            {formData.members.length >= 3 ? (
              <TeamMemberLookup formData={formData} setFormData={setFormData} membersIndex={3} eventId={eventId} />
            ) : null}
            {formData.members.length >= 4 ? (
              <TeamMemberLookup formData={formData} setFormData={setFormData} membersIndex={4} eventId={eventId} />
            ) : null}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              id="submit-team-button"
              size="large"
              fullWidth
              sx={styles.button}
            >
              Create Team
            </Button>
          </Box>
        ) : (
          <Button
            onClick={() => router.push("/auth/sign-in")}
            variant="contained"
            color="primary"
            id="event-team-registration-sign-in-button"
            size="large"
            fullWidth
            sx={styles.button}
          >
            Sign in to register a team
          </Button>
        )}
      </StyledCard>
    </SignUpContainer>
  );
}

function validateFormData(formData, user) {
  const messages = [];
  if (!formData.members.some((member) => member.userId === user.id)) {
    messages.push("You are required to be part of the team.");
  }

  if (formData.members.length < 3 || formData.members.length > 5) {
    messages.push("Teams must have 3 to 5 members.");
  }

  if (!formData.teamName.trim()) {
    messages.push("Team name is required.");
  }

  return messages;
}

export default EventSignUpForm;
