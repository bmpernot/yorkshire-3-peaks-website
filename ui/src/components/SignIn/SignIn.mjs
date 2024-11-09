"use client";

import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Link, TextField, Typography, Card } from "@mui/material";
import ForgotPassword from "./ForgotPassword.mjs";
import { LogoTitle } from "../common/CustomIcons.mjs";
import { StyledCard, StyledContainer as SignInContainer } from "../common/CustomComponents.mjs";
import { styles } from "../../styles/signIn.mui.styles.mjs";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function SignIn() {
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [isForgotPasswordModelOpen, setIsForgotPasswordModelOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setInvalidLogin(false);
    if (emailErrorMessage || isForgotPasswordModelOpen) {
      event.preventDefault();
      return;
    }

    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });

    try {
      ///// need to call aws cognito actions to sign the user in with the email and password from the form /////

      const response = await new Promise((resolve, reject) => {
        const x = true;

        if (x === true) {
          // setTimeout(resolve("Invalid Login"), 1000);
          setTimeout(resolve(), 1000);
        } else {
          setTimeout(reject, 1000);
        }
      });
      /////

      if (response === "Invalid Login") {
        setInvalidLogin(true);
      }
    } catch (error) {
      console.error(new Error(`An Error occurred when trying to sign you in`, { cause: error }));
      toast.error(`An Error occurred when trying to sign you in`);
    }
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <LogoTitle dataCy="sign-in" />
        <Typography component="h1" variant="h4" sx={styles.signIn.title}>
          Sign in
        </Typography>
        {invalidLogin ? <InvalidLogin /> : null}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.signIn.form}>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailErrorMessage || invalidLogin ? true : false}
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
                  setIsForgotPasswordModelOpen(true);
                }}
                variant="body2"
                sx={styles.signIn.forgotPasswordButton}
              >
                Forgot password?
              </Link>
            </Box>
            <TextField
              error={invalidLogin ? true : false}
              name="password"
              placeholder="••••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={invalidLogin ? "error" : "primary"}
            />
          </FormControl>
          <ForgotPassword open={isForgotPasswordModelOpen} setOpen={setIsForgotPasswordModelOpen} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={() => {
              validateInputs({ setEmailErrorMessage });
            }}
          >
            Sign in
          </Button>
          <Typography sx={styles.signIn.signupTitle}>
            Don&apos;t have an account?{" "}
            <span>
              <Link
                onClick={() => {
                  router.push("/auth/sign-up");
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

function InvalidLogin() {
  return (
    <Card variant="outlined" sx={styles.invalidLogin}>
      <Typography sx={{ justifyContent: "center", alignItems: "center" }}>Email or Password was invalid</Typography>
    </Card>
  );
}

const validateInputs = ({ setEmailErrorMessage }) => {
  const email = document.getElementById("email");

  let isValid = true;

  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    setEmailErrorMessage("Please enter a valid email address.");
    isValid = false;
  } else {
    setEmailErrorMessage(null);
  }

  return isValid;
};
