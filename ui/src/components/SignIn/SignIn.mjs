"use client";

import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Link, TextField, Typography } from "@mui/material";
import ForgotPassword from "./ForgotPassword.mjs";
import { LogoTitle } from "../common/CustomIcons.mjs";
import { StyledCard, StyledContainer as SignInContainer } from "../common/CustomComponents.mjs";
import { styles } from "../../styles/signIn.mui.styles.mjs";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { handleSignIn } from "../../lib/cognitoActions.mjs";
import ErrorCard from "../common/ErrorCard.mjs";
import { validateInputs } from "../../lib/commonFunctionsClient.mjs";
import { getErrorMessage } from "../../lib/commonFunctionsServer.mjs";
import { useUser } from "@/src/utils/userContext";

function SignIn() {
  const [errors, setErrors] = useState({ email: [] });
  const [submissionError, setSubmissionError] = useState(null);
  const [isForgotPasswordModelOpen, setIsForgotPasswordModelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { updateUser } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);

    if (isForgotPasswordModelOpen || !validateInputs(setErrors, formValidationSignIn)) {
      return;
    }

    setIsLoading(true);

    const data = new FormData(event.currentTarget);

    try {
      await handleSignIn(router, data.get("email"), data.get("password"), updateUser);
    } catch (error) {
      console.error(new Error(`An error occurred when trying to sign you in`, { cause: error }));
      toast.error(`An error occurred when trying to sign you in`);
      setSubmissionError(getErrorMessage(error.cause));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <LogoTitle dataCy="sign-in" />
        <Typography component="h1" variant="h4" sx={styles.signIn.title}>
          Sign in
        </Typography>
        {submissionError ? <ErrorCard error={submissionError} /> : null}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.signIn.form}>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={errors.email.length > 0}
              helperText={errors.email
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={errors.email.length > 0 ? "error" : "primary"}
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
                id="forgotPassword"
              >
                Forgot password?
              </Link>
            </Box>
            <TextField
              name="password"
              placeholder="••••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <ForgotPassword open={isForgotPasswordModelOpen} setOpen={setIsForgotPasswordModelOpen} router={router} />
          <Button type="submit" fullWidth variant="contained" loading={isLoading} loadingPosition="end">
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

const formValidationSignIn = [
  {
    validation: (email) => {
      return !email.value || !/\S+@\S+\.\S+/.test(email.value);
    },
    errorMessage: "Please enter a valid email address.",
    field: "email",
    element: () => [document.getElementById("email")],
  },
];
