"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, FormControl, FormLabel, TextField, Typography } from "@mui/material";
import { LogoTitle } from "../common/CustomIcons.mjs";
import { StyledCard, StyledContainer as ResetPasswordContainer } from "../common/CustomComponents.mjs";
import { styles } from "../../styles/signIn.mui.styles.mjs";
import { toast } from "react-toastify";
import { handleConfirmResetPassword, handleResetPassword } from "../../lib/cognitoActions.mjs";
import { getErrorMessage } from "../../lib/commonFunctionsServer.mjs";
import { validateInputs } from "../../lib/commonFunctionsClient.mjs";
import ErrorCard from "../common/ErrorCard.mjs";
import { useSearchParams } from "next/navigation";

function ResetPassword() {
  const [errors, setErrors] = useState({
    code: [],
    password: [],
    confirmPassword: [],
  });
  const [submissionError, setSubmissionError] = useState(null);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingResendCode, setIsLoadingResendCode] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
      router.replace("/auth/reset-password");
    } else {
      toast.error("Email not found");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);

    const isValid = validateInputs(setErrors, formValidationsResetPassword);

    if (email && !isValid) {
      toast.error("Email not found, please go to the reset password request form on the sign in page and try again.");
      return;
    }

    setIsLoadingSubmit(true);

    const data = new FormData(event.currentTarget);

    try {
      await handleConfirmResetPassword(router, email, data.get("code"), data.get("password"));
    } catch (error) {
      console.error(new Error(`An error occurred when trying to reset your password`, { cause: error }));
      toast.error(`An error occurred when trying to reset your password`);
      setSubmissionError(getErrorMessage(error.cause));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleResendCode = async () => {
    if (email) {
      try {
        setIsLoadingResendCode(true);
        await handleResetPassword(router, email, true);
        toast.success(`New code sent to ${email}.`);
      } catch (error) {
        console.error(new Error(`An error occurred when trying to confirm your account`, { cause: error }));
        toast.error(`An error occurred when trying to confirm your account.`);
        setSubmissionError(getErrorMessage(error.cause));
      } finally {
        setIsLoadingResendCode(false);
      }
    } else {
      toast.error("Email not found, please go to the reset password request form on the sign in page and try again.");
    }
  };

  return (
    <ResetPasswordContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <LogoTitle dataCy="sign-in" />
        <Typography component="h1" variant="h4" sx={styles.signIn.title}>
          Reset Password
        </Typography>
        <Typography component="p" variant="p">
          Check your spam folder
        </Typography>
        {submissionError ? <ErrorCard error={submissionError} /> : null}
        <Box component="form" onSubmit={handleSubmit} sx={styles.signIn.form} method="POST">
          <FormControl>
            <FormLabel htmlFor="code">Validation Code</FormLabel>
            <TextField
              id="code"
              name="code"
              placeholder="Code"
              autoComplete="code"
              autoFocus
              fullWidth
              variant="outlined"
              error={errors.code.length > 0}
              helperText={errors.code
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.code.length > 0 ? "error" : "primary"}
              sx={styles.formTextField}
            />
          </FormControl>
          <FormControl>
            <Box sx={styles.signIn.passwordBox}>
              <FormLabel htmlFor="password">New Password</FormLabel>
            </Box>
            <TextField
              name="password"
              placeholder="••••••••"
              type="password"
              id="password"
              fullWidth
              variant="outlined"
              error={errors.password.length > 0}
              helperText={errors.password
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.password.length > 0 ? "error" : "primary"}
              sx={styles.formTextField}
            />
          </FormControl>
          <FormControl>
            <Box sx={styles.signIn.passwordBox}>
              <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
            </Box>
            <TextField
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              id="confirmPassword"
              fullWidth
              variant="outlined"
              error={errors.confirmPassword.length > 0}
              helperText={errors.confirmPassword
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.confirmPassword.length > 0 ? "error" : "primary"}
              sx={styles.formTextField}
            />
          </FormControl>
          <Button type="submit" fullWidth variant="contained" disabled={isLoadingSubmit}>
            Reset Password
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              handleResendCode();
            }}
            disabled={isLoadingResendCode}
            id="resendCode"
          >
            Resend code
          </Button>
        </Box>
      </StyledCard>
    </ResetPasswordContainer>
  );
}

function SuspendResetPassword() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}

export default SuspendResetPassword;

const formValidationsResetPassword = [
  {
    validation: (code) => {
      return !code.value || !/\d{6}/.test(code.value);
    },
    errorMessage: "Please enter a valid code.",
    field: "code",
    element: () => [document.getElementById("code")],
  },
  {
    validation: (password) => {
      return !password.value || password.value.length < 8;
    },
    errorMessage: "Password must be at least 8 characters long.",
    field: "password",
    element: () => [document.getElementById("password")],
  },
  {
    validation: (password) => {
      return !/[A-Z]/.test(password.value);
    },
    errorMessage: "Password must have a upper case letter.",
    field: "password",
    element: () => [document.getElementById("password")],
  },
  {
    validation: (password) => {
      return !/[a-z]/.test(password.value);
    },
    errorMessage: "Password must have a lower case letter.",
    field: "password",
    element: () => [document.getElementById("password")],
  },
  {
    validation: (password) => {
      return !/\d/.test(password.value);
    },
    errorMessage: "Password must have a number.",
    field: "password",
    element: () => [document.getElementById("password")],
  },
  {
    validation: (password) => {
      return !/[^$*.[\]{}()?\\!"@#%&/\\,><':;|_~`+=-]/.test(password.value);
    },
    errorMessage: "Password must have special characters.",
    field: "password",
    element: () => [document.getElementById("password")],
  },
  {
    validation: (password, confirmPassword) => {
      return !confirmPassword.value || confirmPassword.value !== password.value;
    },
    errorMessage: "Passwords do not match.",
    field: "confirmPassword",
    element: () => [document.getElementById("password"), document.getElementById("confirmPassword")],
  },
];
