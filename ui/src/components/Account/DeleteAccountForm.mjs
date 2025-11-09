"use client";

import { useState } from "react";
import { Box, Button, FormLabel, FormControl, TextField, Typography } from "@mui/material";
import { StyledCard, StyledContainer } from "../common/CustomComponents.mjs";
import { getErrorMessage } from "../../lib/commonFunctionsServer.mjs";
import { validateInputs } from "../../lib/commonFunctionsClient.mjs";
import { styles } from "../../styles/signUp.mui.styles.mjs";
import { useRouter } from "next/navigation";
import { handleDeleteUser } from "../../lib/cognitoActions.mjs";
import ErrorCard from "../common/ErrorCard.mjs";
import { toast } from "react-toastify";
import { deleteUser } from "@/src/lib/backendActions.mjs";

function DeleteAccountForm({ email, updateUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ confirmDeletion: [] });
  const [submissionError, setSubmissionError] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);

    if (!validateInputs(setErrors, formValidationsDeleteAccount)) {
      return;
    }

    setIsLoading(true);

    try {
      await handleDeleteUser(router);

      await deleteUser();

      try {
        router.push("/");
      } catch (error) {
        throw new Error("An error occurred when trying to redirect you to the home page", { cause: error });
      }

      await updateUser();
      toast.success("Account was successfully deleted");
    } catch (error) {
      console.error(new Error("An error occurred when trying to delete your account", { cause: error }));
      toast.error(`An error occurred when trying to delete your account`);
      setSubmissionError(getErrorMessage(error.cause));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer direction="column" justifyContent="space-between" paddingTop="true">
      <StyledCard variant="outlined">
        <Box sx={styles.titleBox}>
          <Typography component="h1" variant="h4" sx={styles.title}>
            Delete Account
          </Typography>
        </Box>
        {submissionError ? <ErrorCard error={submissionError} /> : null}
        <Box component="form" onSubmit={handleSubmit} sx={styles.formBox} method="POST">
          <FormControl>
            <FormLabel htmlFor="confirmDeletion">Confirm deletion</FormLabel>
            <TextField
              name="confirmDeletion"
              fullWidth
              id="confirmDeletion"
              placeholder={email}
              error={errors.confirmDeletion.length > 0}
              helperText={
                errors.confirmDeletion.length === 0
                  ? "Please enter your email to confirm deletion of the account."
                  : errors.confirmDeletion
                      .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                      .slice(0, -1)
              }
              color={errors.confirmDeletion.length > 0 ? "error" : "primary"}
              sx={styles.formTextField}
            />
          </FormControl>
          <Button type="submit" id="deleteAccount" fullWidth variant="contained" disabled={isLoading}>
            Delete Account
          </Button>
        </Box>
      </StyledCard>
    </StyledContainer>
  );
}

export default DeleteAccountForm;

const formValidationsDeleteAccount = [
  {
    validation: (confirmDeletion, userEmail) => {
      return confirmDeletion.value !== userEmail.value;
    },
    errorMessage: "Please enter the email address of this account.",
    field: "confirmDeletion",
    element: () => [document.getElementById("confirmDeletion"), document.getElementById("email")],
  },
];
