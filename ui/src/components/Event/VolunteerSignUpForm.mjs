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
      // TODO - make api
      await post({
        apiName: "api",
        path: `events/volunteer?eventId=${eventId}`,
        options: { body: { memberId: userId } },
      }).response;

      router.push(`/user/profile`);

      toast.success("Thank you for registering to volunteer.");
    } catch (error) {
      toast.error("Failed to register you as a volunteer.");
    }
  }

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <Typography variant="h4" gutterBottom>
          Volunteer Sign Up
        </Typography>
        <Typography variant="body1" gutterBottom>
          Volunteering involves supporting walkers along the route, helping with checkpoints, providing refreshments,
          assisting with logistics, and ensuring everyone stays safe. No prior experience is necessary - just enthusiasm
          and a willingness to help!
        </Typography>
        {isLoggedIn ? (
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <FormLabel htmlFor="requirements">Additional Requirements</FormLabel>
              <TextField
                id="requirements"
                name="requirements"
                multiline
                rows={3}
                placeholder="E.g. dietary needs, accessibility, medical info"
                inputRef={additionalRequirements}
              />
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              I want to volunteer
            </Button>
          </Box>
        ) : (
          <Button onClick={() => router.push("/auth/sign-in")} variant="contained" color="primary">
            Sign in to volunteer
          </Button>
        )}
      </StyledCard>
    </SignUpContainer>
  );
}

export default VolunteeringSignUpForm;
