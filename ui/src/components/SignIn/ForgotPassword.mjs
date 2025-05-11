"use client";

import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { styles } from "../../styles/signIn.mui.styles.mjs";
import { toast } from "react-toastify";
import { handleResetPassword } from "../../lib/cognitoActions.mjs";
import { validateInputs } from "../../lib/commonFunctionsClient.mjs";
import { getErrorMessage } from "../../lib/commonFunctionsServer.mjs";
import ErrorCard from "../common/ErrorCard.mjs";

function ForgotPassword({ open, setOpen, router }) {
  const [submissionError, setSubmissionError] = useState(null);
  const [errors, setErrors] = useState({ "reset-password-for-email": [] });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setSubmissionError(null);
        setErrors({ email: [] });
        setOpen(false);
      }}
      PaperProps={{
        component: "form",
        onSubmit: async (event) => {
          event.preventDefault();
          setSubmissionError(null);

          if (!open || !validateInputs(setErrors, formValidationForgotPassword)) {
            return;
          }

          setIsLoading(true);

          const formData = new FormData(event.currentTarget);
          const email = formData.get("email");

          try {
            await handleResetPassword(router, email);

            toast.success(`We've sent an email to ${email} with your validation code to reset password`);
            setOpen(false);
          } catch (error) {
            console.error(
              new Error(`An error occurred when trying to send your validation code to reset password to ${email}`, {
                cause: error,
              }),
            );
            toast.error(
              `An error occurred when trying to send your validation code to reset your password to ${email}`,
            );
            setSubmissionError(getErrorMessage(error.cause));
          } finally {
            setIsLoading(false);
          }
        },
        noValidate: true,
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent sx={styles.forgotPassword.dialogContent}>
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a code to reset your password.
        </DialogContentText>
        {submissionError ? <ErrorCard error={submissionError} /> : null}
        <TextField
          autoFocus
          margin="dense"
          id="reset-password-for-email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth={true}
          error={errors["reset-password-for-email"].length > 0}
          helperText={errors["reset-password-for-email"]
            .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
            .slice(0, -1)}
          color={errors["reset-password-for-email"].length > 0 ? "error" : "primary"}
          sx={styles.signIn.emailInput}
        />
      </DialogContent>
      <DialogActions sx={styles.forgotPassword.dialogActions}>
        <Button
          onClick={() => {
            setSubmissionError(null);
            setErrors({ email: [] });
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" type="submit" id="resetPassword" disabled={isLoading}>
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ForgotPassword;

const formValidationForgotPassword = [
  {
    validation: (email) => {
      return !email.value || !/\S+@\S+\.\S+/.test(email.value);
    },
    errorMessage: "Please enter a valid email address.",
    field: "reset-password-for-email",
    element: () => [document.getElementById("reset-password-for-email")],
  },
];
