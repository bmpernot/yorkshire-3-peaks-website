"use client";

import { Typography, Box } from "@mui/material";
import { styles } from "@/src/styles/event.mui.styles.mjs";

function NoEvents() {
  return (
    <Box sx={styles.noEventsBox}>
      <Typography variant="h5" component="h2" sx={styles.noEventsTitle} id="no-events-title">
        No Current Events
      </Typography>
      <Typography variant="body1" sx={styles.noEventsBody} id="no-events-body">
        There are no events currently planned. If you would like to help organize one, please contact us at{" "}
        <strong>yorkshirepeaks@gmail.com</strong>
      </Typography>
    </Box>
  );
}

export default NoEvents;
