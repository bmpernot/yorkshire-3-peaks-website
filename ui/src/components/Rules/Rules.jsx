import { memo } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { styles } from "../../styles/rules.mui.styles.mjs";
import { rulesData } from "./rulesData.jsx";
import RuleSection from "./RuleSection.jsx";

const PDF_URL = "/documents/Yorkshire Three Peaks Rules.pdf";
const TITLE = "Event Rules";
const BUTTON_TEXT = "Download Rules PDF";

const Rules = memo(function RulesComponent() {
  return (
    <Container maxWidth="md" sx={styles.pageContainer}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={styles.mainTitle}>
        {TITLE}
      </Typography>
      {rulesData.map((section) => (
        <RuleSection key={section.id} section={section} />
      ))}
      <Box sx={styles.downloadButtonBox}>
        <Button href={PDF_URL} variant="contained" size="large">
          {BUTTON_TEXT}
        </Button>
      </Box>
    </Container>
  );
});

export default Rules;
