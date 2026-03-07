"use client";

import EventRegistrationForm from "./EventRegistrationForm.mjs";
import { Typography, Grid, Box } from "@mui/material";
import { styles } from "@/src/styles/event.mui.styles.mjs";

import { useRouter } from "next/navigation";
import { useUser } from "@/src/utils/userContext";

function Organisers() {
  const router = useRouter();
  const { loggedIn } = useUser();

  const isLoggedIn = loggedIn();

  return (
    <Box sx={{ maxWidth: "1200px" }}>
      <Typography variant="h3" component="h1" sx={styles.mainTitle}>
        Organisers
      </Typography>
      <Grid container={true} spacing={{ xs: 2, sm: 3, md: 4 }} sx={styles.gridPadding}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <EventRegistrationForm router={router} isLoggedIn={isLoggedIn} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Organisers;
