import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Link, TextField, Typography, Stack, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword.mjs";
import { LogoTitle } from "../common/CustomIcons.mjs";
import { styles } from "../../styles/signIn.mui.styles.mjs";

function SignIn({ setUser, setPageView }) {
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = (event) => {
    if (emailErrorMessage || passwordErrorMessage) {
      event.preventDefault();
      return;
    }

    // TODO - need to make sure that the submit of forget password form does not trigger this

    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });

    // TODO - temp data - will delete once i figure out how to make an aws user
    setUser({
      firstName: "Bruce",
      lastName: "Wayne",
      email: "bruce.wayne@waynecorp.com",
      number: "01234567890",
      iceNumber: "01234567891",
      role: "admin",
    });

    // navigate to account page
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <LogoTitle dataCy="sign-in" />
        <Typography component="h1" variant="h4" sx={styles.signIn.title}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.signIn.form}>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailErrorMessage ? true : false}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailErrorMessage ? "error" : "primary"}
              sx={styles.signIn.emailInput}
            />
          </FormControl>
          <FormControl>
            <Box sx={styles.signIn.passwordBox}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Link
                component="button"
                type="button"
                onClick={() => {
                  setOpen(true);
                }}
                variant="body2"
                sx={styles.signIn.forgotPasswordButton}
              >
                Forgot password?
              </Link>
            </Box>
            <TextField
              error={passwordErrorMessage ? true : false}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordErrorMessage ? "error" : "primary"}
            />
          </FormControl>
          <ForgotPassword open={open} setOpen={setOpen} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={() => {
              validateInputs({ setEmailErrorMessage, setPasswordErrorMessage });
            }}
          >
            Sign in
          </Button>
          <Typography sx={styles.signIn.signupTitle}>
            Don&apos;t have an account?{" "}
            <span>
              <Link
                onClick={() => {
                  setPageView("signUp");
                }}
                variant="body2"
                sx={styles.signIn.signUpLink}
              >
                Sign up
              </Link>
            </span>
          </Typography>
        </Box>
      </StyledCard>
    </SignInContainer>
  );
}

export default SignIn;

const validateInputs = ({ setEmailErrorMessage, setPasswordErrorMessage }) => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  let isValid = true;

  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    setEmailErrorMessage("Please enter a valid email address.");
    isValid = false;
  } else {
    setEmailErrorMessage(null);
  }

  if (!password.value || password.value.length < 8) {
    setPasswordErrorMessage("Password must be at least 8 characters long.");
    isValid = false;
  } else {
    setPasswordErrorMessage(null);
  }

  return isValid;
};

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow: "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));
