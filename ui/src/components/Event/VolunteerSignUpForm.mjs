"use client";

import { Typography, Button, Box, FormControl, FormLabel, TextField } from "@mui/material";
import { StyledCard, StyledContainer as SignUpContainer } from "../common/CustomComponents.mjs";
import { useRef } from "react";
import { toast } from "react-toastify";
import { post } from "aws-amplify/api";

function VolunteeringSignUpForm({ eventId, router, userId, isLoggedIn }) {
  const additionalRequirements = useRef();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const registrationData = { memberId: userId };

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
    } catch (error) {
      toast.error("Failed to register you as a volunteer.");
    }
  }

  return (
    <SignUpContainer direction="column" justifyContent="space-between" paddingTop={true}>
      <StyledCard variant="outlined" sx={{ height: "fit-content" }} noMaxWidth={true}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 2,
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
            fontWeight: 600,
            color: "primary.main",
          }}
        >
          Volunteer Registration
        </Typography>

        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: "warning.light",
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "warning.contrastText",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              lineHeight: 1.6,
            }}
            id="volunteer-registration-information"
          >
            <strong>What volunteers do:</strong>
            <br />
            Support walkers along the route, help with checkpoints, provide refreshments, assist with logistics, and
            ensure everyone stays safe. No prior experience necessary - just enthusiasm and willingness to help!
          </Typography>
        </Box>
        {isLoggedIn ? (
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Additional Requirements</FormLabel>
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
              sx={{
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: "1rem", sm: "1.125rem" },
                fontWeight: 600,
              }}
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
            sx={{
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: "1rem", sm: "1.125rem" },
              fontWeight: 600,
            }}
          >
            Sign in to volunteer
          </Button>
        )}
      </StyledCard>
    </SignUpContainer>
  );
}

export default VolunteeringSignUpForm;
