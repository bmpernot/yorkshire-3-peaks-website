"use client";

import { Typography, Grid2 } from "@mui/material";
import { StyledCard, StyledContainer as SignUpContainer } from "../common/CustomComponents.mjs";

function EventInformation({ eventInformation }) {
  // TODO - replace walkers needed and volunteers needed with a hollow pie chart diagram
  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <Typography variant="h4" gutterBottom>
          Current Event Overview
        </Typography>
        <Grid2 container spacing={3}>
          <Grid2 item="true" xs={6} sm={3}>
            <Typography variant="h6">Walkers Needed</Typography>
            <Typography>{eventInformation.walkersNeeded}</Typography>
          </Grid2>
          <Grid2 item="true" xs={6} sm={3}>
            <Typography variant="h6">Volunteers Needed</Typography>
            <Typography>{eventInformation.volunteersNeeded}</Typography>
          </Grid2>
          <Grid2 item="true" xs={6} sm={3}>
            <Typography variant="h6">Money Raised</Typography>
            <Typography>£{eventInformation.moneyRaised}</Typography>
          </Grid2>
          <Grid2 item="true" xs={6} sm={3}>
            <Typography variant="h6">Event Date</Typography>
            <Typography>
              {new Date(eventInformation.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Typography>
          </Grid2>
        </Grid2>
      </StyledCard>
    </SignUpContainer>
  );
}

export default EventInformation;
