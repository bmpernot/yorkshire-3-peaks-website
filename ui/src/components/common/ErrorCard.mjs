import { styles } from "../../styles/signIn.mui.styles.mjs";
import { Typography, Card } from "@mui/material";

function ErrorCard({ error }) {
  return (
    <Card variant="outlined" sx={styles.invalidLogin}>
      <Typography sx={{ justifyContent: "center", alignItems: "center" }}>{error}</Typography>
    </Card>
  );
}

export default ErrorCard;
