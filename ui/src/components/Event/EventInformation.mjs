"use client";

import { Typography, Grid2, Box } from "@mui/material";
import { StyledCard, StyledContainer as SignUpContainer } from "../common/CustomComponents.mjs";
import { PieChart } from "@mui/x-charts/PieChart";

function EventInformation({ eventInformation }) {
  const eventStartDate = new Date(eventInformation.startDate);
  const eventEndDate = new Date(eventInformation.endDate);

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <Typography variant="h3" gutterBottom>
          Current Event Overview
        </Typography>
        <Grid2 container>
          <Grid2
            item="true"
            size={{ md: 6, sm: 12 }}
            id="walkers-needed-info"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ marginBottom: -4 }}>
              Walkers Needed:
            </Typography>
            <CustomPieChart required={eventInformation.requiredWalkers} current={eventInformation.currentWalkers} />
          </Grid2>
          <Grid2
            item="true"
            size={{ md: 6, sm: 12 }}
            id="volunteers-needed-info"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ marginBottom: -4 }}>
              Volunteers Needed:
            </Typography>
            <CustomPieChart
              required={eventInformation.requiredVolunteers}
              current={eventInformation.currentVolunteers}
            />
          </Grid2>
          <Grid2
            item="true"
            size={{ md: 6, sm: 12 }}
            id="money-raised-info"
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginTop: 2 }}
          >
            <Typography variant="h4">Money Raised:</Typography>
            <Typography variant="h6">£{eventInformation.moneyRaised}</Typography>
          </Grid2>
          <Grid2
            item="true"
            size={{ md: 6, sm: 12 }}
            id="event-date-info"
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginTop: 2 }}
          >
            <Typography variant="h4">Event Date:</Typography>
            <Typography variant="h6">
              {eventStartDate.getDate()}
              {" - "}
              {eventEndDate.toLocaleDateString("en-GB", {
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

function CustomPieChart({ required, current }) {
  const percentage = Math.round((current / required) * 100);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width={200}>
      <Box position="relative" width={200} height={200}>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: current, label: "Registered" },
                {
                  id: 1,
                  value: Math.max(0, required - current),
                  label: "Remaining",
                },
              ],
              innerRadius: 30,
              outerRadius: 60,
            },
          ]}
          width={200}
          height={200}
          hideLegend={true}
          colors={["#8dc550", "transparent"]}
        />
        <Typography
          variant="h6"
          component="div"
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
          }}
        >
          {percentage}%
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ marginTop: -3, fontWeight: "bold" }}>
        {current}/{required}
      </Typography>
    </Box>
  );
}

export default EventInformation;
