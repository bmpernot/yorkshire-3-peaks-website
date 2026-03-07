import { styles } from "@/src/styles/event.mui.styles.mjs";
import { Typography, Box, Button } from "@mui/material";

function TeamRegistrationInformation({ router }) {
  return (
    <Box sx={styles.box}>
      <Typography variant="body1" sx={styles.description} id="team-registration-information">
        • Teams must have <strong>3 - 5 members</strong> and must include yourself.
        <br />
        • All members must have an account.
        <br />
        <br />
        For more information about the registration process please view our guide:
        <br />
        <Button
          fullWidth
          data-cy="Registration guide"
          onClick={() => router.push("/event/registration-guide")}
          sx={styles.buttonHollow}
        >
          Registration guide
        </Button>
      </Typography>
    </Box>
  );
}

export default TeamRegistrationInformation;
