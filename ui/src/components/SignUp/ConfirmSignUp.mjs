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
import { useUser } from "@/src/utils/userContext";
import { useSearchParams } from "next/navigation";

function ConfirmSignUp() {
  const [codeErrorMessage, setCodeErrorMessage] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingResendCode, setIsLoadingResendCode] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const { updateUser } = useUser();

  useEffect(() => {
    const emailFromParams = searchParams.get("email");

    if (emailFromParams) {
      setEmail(emailFromParams);
      router.replace("/auth/confirm-signup");
    } else {
      toast.error("Email not found");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);

    const isValid = validateInputs({ setCodeErrorMessage });

    if (!isValid) {
      return;
    }

    setIsLoadingSubmit(true);

    const data = new FormData(event.currentTarget);

    const formData = { username: email, confirmationCode: data.get("code") };

    try {
      await handleConfirmSignUp(router, formData, updateUser);
    } catch (error) {
      console.error(new Error(`An Error occurred when trying to confirm your account`, { cause: error }));
      toast.error(`An Error occurred when trying to confirm your account.`);
      setSubmissionError(getErrorMessage(error.cause));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleResendCode = async () => {
    if (email) {
      try {
        setIsLoadingResendCode(true);
        await handleSendEmailVerificationCode(email);
        toast.success(`New code sent to ${email}.`);
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
  const code = document.getElementById("code").value;

  let isValid = true;

  if (!code|| code.length !== 6 || !/\d{6}/.test(code)) {
    setCodeErrorMessage("Please enter a valid code.");
    isValid = false;
  } else {
    setCodeErrorMessage(null);
  }

  return isValid;
};
