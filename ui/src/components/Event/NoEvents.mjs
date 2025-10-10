"use client";

import { Typography, Box } from "@mui/material";

function NoEvents() {
  return (
    <Box sx={{ 
      mt: { xs: 3, sm: 4 },
      p: { xs: 3, sm: 4 },
      textAlign: "center",
      bgcolor: "warning.light",
      borderRadius: 3,
      border: "1px solid",
      borderColor: "warning.main"
    }}>
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{
          mb: 2,
          fontWeight: 600,
          color: "warning.contrastText",
          fontSize: { xs: "1.25rem", sm: "1.5rem" }
        }}
        id="no-events"
      >
        No Current Events
      </Typography>
      <Typography 
        variant="body1" 
        sx={{
          color: "warning.contrastText",
          fontSize: { xs: "0.875rem", sm: "1rem" },
          lineHeight: 1.6
        }}
      >
        There are no events currently planned. If you would like to help organize one, please contact us at{" "}
        <strong>yorkshirepeaks@gmail.com</strong>
      </Typography>
    </Box>
  );
}

export default NoEvents;
