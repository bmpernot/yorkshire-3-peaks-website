"use client";

import { Typography, Button, Box, FormControl, FormLabel, TextField } from "@mui/material";
import { StyledCard, StyledContainer as SignUpContainer } from "../common/CustomComponents.mjs";
import { useRef } from "react";
import { toast } from "react-toastify";
import { post } from "aws-amplify/api";
import { styles } from "@/src/styles/event.mui.styles.mjs";

function VolunteeringSignUpForm({ eventId, router, isLoggedIn }) {
  const additionalRequirements = useRef();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const registrationData = {};

      if (additionalRequirements.current.value?.length > 0) {
        registrationData.additionalRequirements = additionalRequirements.current.value;
      }

      const { body } = await post({
        apiName: "api",
        path: `events/volunteer?eventId=${eventId}`,
        options: { body: registrationData },
      }).response;
      const data = await body.text();

      toast.success(data);
      router.push(`/user/profile`);
    } catch {
      toast.error("Failed to register you as a volunteer.");
    }
  }

  return (
    <SignUpContainer direction="column" justifyContent="space-between" paddingTop="true">
      <StyledCard variant="outlined" sx={styles.card} nomaxwidth="true">
        <Typography variant="h4" component="h2" sx={styles.title}>
          Volunteer Registration
        </Typography>

        <Box sx={styles.box}>
          <Typography variant="body1" sx={styles.description} id="volunteer-registration-information">
            <strong>What volunteers do:</strong>
            <br />
            Support walkers along the route, help with checkpoints, provide refreshments, assist with logistics, and
            ensure everyone stays safe. No prior experience necessary - just enthusiasm and willingness to help!
          </Typography>
        </Box>
        {isLoggedIn ? (
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth sx={styles.form}>
              <FormLabel sx={styles.formLabel}>Additional Requirements</FormLabel>
              <TextField
                id="additional-requirements-volunteer"
                name="requirements"
                multiline
                rows={3}
                placeholder="E.g. dietary needs, accessibility, medical info"
                inputRef={additionalRequirements}
                variant="outlined"
                size="medium"
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              id="volunteer-registration-button"
              sx={styles.button}
            >
              I want to volunteer
            </Button>
          </Box>
        ) : (
          <Button
            onClick={() => router.push("/auth/sign-in")}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            id="event-volunteer-registration-sign-in-button"
            sx={styles.button}
          >
            Sign in to volunteer
          </Button>
        )}
      </StyledCard>
    </SignUpContainer>
  );
}

export default VolunteeringSignUpForm;
