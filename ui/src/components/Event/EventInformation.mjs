"use client";

import { Typography, Grid2, Box } from "@mui/material";
import { StyledCard, StyledContainer as SignUpContainer } from "../common/CustomComponents.mjs";
import { PieChart } from "@mui/x-charts/PieChart";

function EventInformation({ eventInformation }) {
  const eventStartDate = new Date(eventInformation.startDate);
  const eventEndDate = new Date(eventInformation.endDate);

  return (
    <SignUpContainer direction="column" justifyContent="space-between" paddingTop={true}>
      <StyledCard variant="outlined" noMaxWidth={true}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
            fontWeight: 600,
            color: "primary.main",
          }}
        >
          Event Overview
        </Typography>

        <Grid2 container spacing={{ xs: 3, sm: 4 }}>
          <Grid2 size={{ xs: 12, sm: 6 }} id="walkers-needed-info">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 500,
                  fontSize: { xs: "1.125rem", sm: "1.25rem" },
                }}
              >
                Walkers Needed
              </Typography>
              <CustomPieChart required={eventInformation.requiredWalkers} current={eventInformation.currentWalkers} />
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }} id="volunteers-needed-info">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 500,
                  fontSize: { xs: "1.125rem", sm: "1.25rem" },
                }}
              >
                Volunteers Needed
              </Typography>
              <CustomPieChart
                required={eventInformation.requiredVolunteers}
                current={eventInformation.currentVolunteers}
              />
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }} id="money-raised-info">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                bgcolor: "success.light",
                color: "success.contrastText",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  fontSize: { xs: "1.125rem", sm: "1.25rem" },
                }}
              >
                Money Raised
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                }}
              >
                £{eventInformation.moneyRaised}
              </Typography>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }} id="event-date-info">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                bgcolor: "primary.light",
                color: "primary.contrastText",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  fontSize: { xs: "1.125rem", sm: "1.25rem" },
                }}
              >
                Event Date
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                }}
              >
                {eventStartDate.getDate()}
                {" - "}
                {eventEndDate.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Grid2>
        </Grid2>
      </StyledCard>
    </SignUpContainer>
  );
}

function CustomPieChart({ required, current }) {
  const percentage = Math.round((current / required) * 100);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: { xs: 160, sm: 180, md: 200 } }}>
      <Box position="relative" sx={{ width: { xs: 160, sm: 180, md: 200 }, height: { xs: 160, sm: 180, md: 200 } }}>
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
          variant="h5"
          component="div"
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: "translate(-50%, -50%)",
            fontWeight: 700,
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            color: "text.primary",
          }}
        >
          {percentage}%
        </Typography>
      </Box>
      <Typography
        variant="h6"
        sx={{
          mt: 1,
          fontWeight: 600,
          fontSize: { xs: "1rem", sm: "1.125rem" },
          color: "text.secondary",
        }}
      >
        {current} / {required}
      </Typography>
    </Box>
  );
}

export default EventInformation;
