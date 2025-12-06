import { styles } from "@/src/styles/event.mui.styles.mjs";
import { Typography, Box } from "@mui/material";

function TeamRegistrationInformation() {
  return (
    <Box sx={styles.box}>
      <Typography variant="body1" sx={styles.description} id="team-registration-information">
        • Teams must have <strong>3 - 5 members</strong> and must include yourself.
        <br />
        • Payment is managed on your profile page. Each member can contribute, but your team must meet or exceed the
        full amount.
        <br />
        • You can edit your team details anytime from your profile.
        <br />
        • All team members will have access to update the entry.
        <br />
        • Disabled users in the user search are ones that have already signed up to a team.
        <br />
      </Typography>
    </Box>
  );
}

export default TeamRegistrationInformation;
