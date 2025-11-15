"use client";

import { Typography, Grid2, Box } from "@mui/material";
import { StyledCard, StyledContainer as SignUpContainer } from "../common/CustomComponents.mjs";
import { PieChart } from "@mui/x-charts/PieChart";
import { styles } from "@/src/styles/event.mui.styles.mjs";

function EventInformation({ eventInformation }) {
  const eventStartDate = new Date(eventInformation.startDate);
  const eventEndDate = new Date(eventInformation.endDate);

  return (
    <SignUpContainer direction="column" justifyContent="space-between" paddingTop="true">
      <StyledCard variant="outlined" nomaxwidth="true">
        <Typography variant="h4" component="h2" sx={styles.subTitle}>
          Event Overview
        </Typography>

        <Grid2 container spacing={{ xs: 3, sm: 4 }}>
          <Grid2 size={{ xs: 12, sm: 6 }} id="walkers-needed-info">
            <CustomPieChart
              title="Walkers Needed"
              required={eventInformation.requiredWalkers}
              current={eventInformation.currentWalkers}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }} id="volunteers-needed-info">
            <CustomPieChart
              title="Volunteers Needed"
              required={eventInformation.requiredVolunteers}
              current={eventInformation.currentVolunteers}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }} id="money-raised-info">
            <InformationBlock title={"Money Raised"} value={`£${eventInformation.moneyRaised}`} />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }} id="event-date-info">
            <InformationBlock
              title={"Event Date"}
              value={`${eventStartDate.getDate()} - ${eventEndDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`}
            />
          </Grid2>
        </Grid2>
      </StyledCard>
    </SignUpContainer>
  );
}

function CustomPieChart({ title, required, current }) {
  const percentage = Math.round((current / required) * 100);

  return (
    <Box sx={styles.pieChart}>
      <Typography variant="h5" sx={styles.pieChartTitle}>
        {title}
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" sx={styles.pieChartOuterBox}>
        <Box position="relative" sx={styles.pieChartInnerBox}>
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
            colors={["#8dc550", "#dddddd"]}
          />
          <Typography
            variant="h5"
            component="div"
            position="absolute"
            top="50%"
            left="50%"
            sx={styles.pieChartPercentage}
          >
            {percentage}%
          </Typography>
        </Box>
        <Typography variant="h6" sx={styles.pieChartValue}>
          {current} / {required}
        </Typography>
      </Box>
    </Box>
  );
}

function InformationBlock({ title, value }) {
  return (
    <Box sx={styles.informationBlock}>
      <Typography variant="h5" sx={styles.informationBlockTitle}>
        {title}
      </Typography>
      <Typography variant="h4" sx={styles.informationBlockValue}>
        {value}
      </Typography>
    </Box>
  );
}

export default EventInformation;
