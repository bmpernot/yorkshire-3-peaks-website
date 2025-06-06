import { AppBar, Typography, Container, IconButton, Box } from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import { styles } from "../../styles/footer.mui.styles.mjs";
import { openEmail } from "../../lib/commonFunctionsClient.mjs";

function Footer() {
  return (
    <AppBar data-cy="footer" position="static" sx={styles.appBar}>
      <Container maxWidth="xl">
        <Typography data-cy="title" sx={{ ...styles.typography.bold, pt: 2 }} variant="h5">
          Yorkshire 3 Peaks
        </Typography>
        <Typography data-cy="description" sx={styles.typography.normal}>
          Yorkshire 3 Peaks is a charity event run by volunteers and is always welcoming of new helpers. <br />
          If you are interested in helping out contact us using the email below.
          <br />
          Feel free to pass this website on to anyone you think would be interested. The more the merrier.
        </Typography>
        <Typography data-cy="copyright" sx={styles.typography.normal}>
          Copyright &copy; {new Date().getFullYear()} Ben Pernot
          <br />
        </Typography>
        <Box sx={styles.button.box}>
          <IconButton data-cy="contact-info" sx={styles.button.icon} onClick={openEmail}>
            <EmailIcon />
            <Typography sx={styles.typography.bold}>: yorkshirepeaks@gmail.com</Typography>
          </IconButton>
        </Box>
      </Container>
    </AppBar>
  );
}

export default Footer;
