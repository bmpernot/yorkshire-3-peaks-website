"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, FormControl, FormLabel, TextField, Typography } from "@mui/material";
import { LogoTitle } from "../common/CustomIcons.mjs";
import { StyledCard, StyledContainer as ConfirmSignUpContainer } from "../common/CustomComponents.mjs";
import { styles } from "../../styles/signIn.mui.styles.mjs";
import { toast } from "react-toastify";
import { handleConfirmSignUp, handleSendEmailVerificationCode } from "../../lib/cognitoActions.mjs";
import { getErrorMessage } from "../../lib/commonFunctionsServer.mjs";
import ErrorCard from "../common/ErrorCard.mjs";

function ConfirmSignUp() {
  const [codeErrorMessage, setCodeErrorMessage] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingResendCode, setIsLoadingResendCode] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("userEmail")) {
      toast.error(
        "Failed to pass email to this page - please make sure you allow cookies for this website and start the process again",
      );
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);
    if (codeErrorMessage) {
      return;
    }

    setIsLoadingSubmit(true);

    const data = new FormData(event.currentTarget);
    const email = sessionStorage.getItem("userEmail");

    if (!email) {
      toast.error(
        "Failed to pass email to this page - please make sure you allow cookies for this website and start the process again",
      );
    }

    const formData = { email: sessionStorage.getItem("userEmail"), code: data.get("code") };

    try {
      await handleConfirmSignUp(router, formData);
    } catch (error) {
      console.error(new Error(`An Error occurred when trying to confirm your account`, { cause: error }));
      toast.error(`An Error occurred when trying to confirm your account.`);
      setSubmissionError(getErrorMessage(error.cause));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleResendCode = async () => {
    const email = sessionStorage.getItem("userEmail");
    if (email) {
      try {
        setIsLoadingResendCode(true);
        await handleSendEmailVerificationCode(email);
      } catch (error) {
        console.error(new Error(`An Error occurred when trying to confirm your account`, { cause: error }));
        toast.error(`An Error occurred when trying to confirm your account.`);
        setSubmissionError(getErrorMessage(error.cause));
      } finally {
        setIsLoadingResendCode(false);
      }
    }
  };

  return (
    <ConfirmSignUpContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <LogoTitle dataCy="sign-in" />
        <Typography component="h1" variant="h4" sx={styles.signIn.title}>
          Confirm Account
        </Typography>
        {submissionError ? <ErrorCard error={submissionError} /> : null}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.signIn.form}>
          <FormControl>
            <FormLabel htmlFor="code">Confirmation code</FormLabel>
            <TextField
              error={codeErrorMessage ? true : false}
              helperText={codeErrorMessage}
              id="code"
              type="code"
              name="code"
              placeholder="Your confirmation code"
              autoComplete="code"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={codeErrorMessage ? "error" : "primary"}
              sx={styles.signIn.codeInput}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={() => {
              validateInputs({ setCodeErrorMessage });
            }}
            disabled={isLoadingSubmit}
          >
            Submit
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              handleResendCode();
            }}
            disabled={isLoadingResendCode}
          >
            Resend code
          </Button>
        </Box>
      </StyledCard>
    </ConfirmSignUpContainer>
  );
}

export default ConfirmSignUp;

const validateInputs = ({ setCodeErrorMessage }) => {
  const code = document.getElementById("code");

  let isValid = true;

  if (!code.value || code.value.length !== 4) {
    setCodeErrorMessage("Please enter a valid code.");
    isValid = false;
  } else {
    setCodeErrorMessage(null);
  }

  return isValid;
};
