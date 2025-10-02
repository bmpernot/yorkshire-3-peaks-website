"use client";

import { Typography, Box } from "@mui/material";

function NoEvents() {
  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" component="span" align="left" id="no-events">
        There are no current events planned - if you would like to help set one up please contact us at
        yorkshirepeaks@gmail.com
      </Typography>
    </Box>
  );
}

export default NoEvents;
