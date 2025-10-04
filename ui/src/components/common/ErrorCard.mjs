import { styles } from "../../styles/signIn.mui.styles.mjs";
import { Typography, Card } from "@mui/material";

function ErrorCard({ error, index = "0" }) {
  return (
    <Card variant="outlined" sx={styles.invalidLogin} id={`error-card-${index}`}>
      <Typography sx={{ justifyContent: "center", alignItems: "center" }}>{error}</Typography>
    </Card>
  );
}

export default ErrorCard;
