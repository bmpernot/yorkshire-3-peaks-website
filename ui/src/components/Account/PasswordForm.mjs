"use client";

import { useState } from "react";
import { Box, Button, FormLabel, FormControl, TextField, Typography } from "@mui/material";
import { StyledCard, StyledContainer } from "../common/CustomComponents.mjs";
import { isErrors, getErrorMessage } from "../../lib/commonFunctionsServer.mjs";
import { validateInputs } from "../../lib/commonFunctionsClient.mjs";
import { styles } from "../../styles/signUp.mui.styles.mjs";
import { handleUpdatePassword } from "../../lib/cognitoActions.mjs";
import ErrorCard from "../common/ErrorCard.mjs";
import { toast } from "react-toastify";

function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: [],
    confirmNewPassword: [],
  });
  const [submissionError, setSubmissionError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);
    if (isErrors(errors)) {
      return;
    }

    setIsLoading(true);

    const data = new FormData(event.currentTarget);
    const formData = {
      oldPassword: data.get("oldPassword"),
      newPassword: data.get("newPassword"),
    };

    try {
      await handleUpdatePassword(formData);

      toast.success("Password was successfully updated");

      document.getElementById("oldPassword").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("confirmNewPassword").value = "";
    } catch (error) {
      console.error(new Error("An error occurred when trying to update your password", { cause: error }));
      toast.error(`An error occurred when trying to update your password`);
      setSubmissionError(getErrorMessage(error.cause));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <Box sx={styles.titleBox}>
          <Typography component="h1" variant="h4" sx={styles.title}>
            Update password
          </Typography>
        </Box>
        {submissionError ? <ErrorCard error={submissionError} /> : null}
        <Box component="form" onSubmit={handleSubmit} sx={styles.formBox} method="POST">
          <FormControl>
            <FormLabel htmlFor="oldPassword">Old Password</FormLabel>
            <TextField
              fullWidth
              name="oldPassword"
              placeholder="••••••••"
              type="password"
              id="oldPassword"
              variant="outlined"
              sx={styles.formTextField}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="newPassword">New Password</FormLabel>
            <TextField
              fullWidth
              name="newPassword"
              placeholder="••••••••"
              type="password"
              id="newPassword"
              variant="outlined"
              error={errors.newPassword.length > 0}
              helperText={errors.newPassword
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.newPassword.length > 0 ? "error" : "primary"}
              sx={styles.formTextField}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="confirmNewPassword">Confirm New Password</FormLabel>
            <TextField
              fullWidth
              name="confirmNewPassword"
              placeholder="••••••••"
              type="password"
              id="confirmNewPassword"
              variant="outlined"
              error={errors.confirmNewPassword.length > 0}
              helperText={errors.confirmNewPassword
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.confirmNewPassword.length > 0 ? "error" : "primary"}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={() => validateInputs(setErrors, formValidationsPassword)}
            disabled={isLoading}
            loading={isLoading}
          >
            Update password
          </Button>
        </Box>
      </StyledCard>
    </StyledContainer>
  );
}

export default PasswordForm;

const formValidationsPassword = [
  {
    validation: (newPassword) => {
      return !newPassword.value || newPassword.value.length < 8;
    },
    errorMessage: "Password must be at least 8 characters long.",
    field: "newPassword",
    element: () => [document.getElementById("newPassword")],
  },
  {
    validation: (newPassword) => {
      return !/[A-Z]/.test(newPassword.value);
    },
    errorMessage: "Password must have a upper case letter.",
    field: "newPassword",
    element: () => [document.getElementById("newPassword")],
  },
  {
    validation: (newPassword) => {
      return !/[a-z]/.test(newPassword.value);
    },
    errorMessage: "Password must have a lower case letter.",
    field: "newPassword",
    element: () => [document.getElementById("newPassword")],
  },
  {
    validation: (newPassword) => {
      return !/\d/.test(newPassword.value);
    },
    errorMessage: "Password must have a number.",
    field: "newPassword",
    element: () => [document.getElementById("newPassword")],
  },
  {
    validation: (newPassword) => {
      return !/[^$*.[\]{}()?\\!"@#%&/\\,><':;|_~`+=-]/.test(newPassword.value);
    },
    errorMessage: "Password must have special characters.",
    field: "newPassword",
    element: () => [document.getElementById("newPassword")],
  },

  {
    validation: (newPassword, oldPassword) => {
      return newPassword.value === oldPassword.value;
    },
    errorMessage: "New password cannot be the old password.",
    field: "newPassword",
    element: () => [document.getElementById("newPassword"), document.getElementById("oldPassword")],
  },
  {
    validation: (confirmNewPassword, newPassword) => {
      return !confirmNewPassword.value || confirmNewPassword.value !== newPassword.value;
    },
    errorMessage: "Passwords do not match.",
    field: "confirmNewPassword",
    element: () => [document.getElementById("confirmNewPassword"), document.getElementById("newPassword")],
  },
];
