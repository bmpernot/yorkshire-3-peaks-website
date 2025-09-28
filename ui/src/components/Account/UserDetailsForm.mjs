"use client";

import { useState } from "react";
import { Box, Button, Checkbox, FormLabel, FormControlLabel, FormControl, TextField, Typography } from "@mui/material";
import { StyledCard, StyledContainer } from "../common/CustomComponents.mjs";
import { getErrorMessage } from "../../lib/commonFunctionsServer.mjs";
import { validateInputs } from "../../lib/commonFunctionsClient.mjs";
import { styles } from "../../styles/signUp.mui.styles.mjs";
import { handleUpdateUserAttributes } from "../../lib/cognitoActions.mjs";
import ErrorCard from "../common/ErrorCard.mjs";
import { toast } from "react-toastify";
import { phone } from "phone";

function UserDetailsForm({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fname: [],
    lname: [],
    number: [],
    iceNumber: [],
  });
  const [submissionError, setSubmissionError] = useState(false);
  const [formData, setFormData] = useState({
    fname: user.firstName,
    lname: user.lastName,
    number: user.number,
    iceNumber: user.iceNumber,
    notify: Boolean(user.notify),
  });

  const handleInputChange = (e, value) => {
    setFormData({ ...formData, [e.target.name]: value ?? e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);

    if (!validateInputs(setErrors, formValidationsUserDetails)) {
      return;
    }

    setIsLoading(true);

    const data = new FormData(event.currentTarget);

    try {
      await handleUpdateUserAttributes(
        data.get("fname"),
        data.get("lname"),
        phone(data.get("number"), { country: "GB" }).phoneNumber,
        phone(data.get("iceNumber"), { country: "GB" }).phoneNumber,
        data.get("notify") ? "true" : "false",
      );
      toast.success("Your details have been updated");
    } catch (error) {
      console.error(new Error("An error occurred when trying to update your details", { cause: error }));
      toast.error(`An error occurred when trying to update your details`);
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
            Update details
          </Typography>
        </Box>
        {submissionError ? <ErrorCard error={submissionError} /> : null}
        <Box component="form" onSubmit={handleSubmit} sx={styles.formBox} method="POST">
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              fullWidth
              id="email"
              name="email"
              variant="outlined"
              disabled={true}
              value={user.email}
              sx={styles.formTextField}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="fname">First name</FormLabel>
            <TextField
              autoComplete="fname"
              name="fname"
              fullWidth
              id="fname"
              value={formData.fname}
              error={errors.fname.length > 0}
              helperText={errors.fname
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.fname.length > 0 ? "error" : "primary"}
              onChange={handleInputChange}
              sx={styles.formTextField}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lname">Last name</FormLabel>
            <TextField
              autoComplete="lname"
              name="lname"
              fullWidth
              id="lname"
              value={formData.lname}
              error={errors.lname.length > 0}
              helperText={errors.lname
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.lname.length > 0 ? "error" : "primary"}
              onChange={handleInputChange}
              sx={styles.formTextField}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="number">Phone Number</FormLabel>
            <TextField
              autoComplete="number"
              name="number"
              fullWidth
              id="number"
              value={formData.number}
              error={errors.number.length > 0}
              helperText={errors.number
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.number.length > 0 ? "error" : "primary"}
              onChange={handleInputChange}
              sx={styles.formTextField}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="iceNumber">In Case of Emergency (ICE) Phone Number</FormLabel>
            <TextField
              autoComplete="iceNumber"
              name="iceNumber"
              fullWidth
              id="iceNumber"
              value={formData.iceNumber}
              error={errors.iceNumber.length > 0}
              helperText={errors.iceNumber
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.iceNumber.length > 0 ? "error" : "primary"}
              onChange={handleInputChange}
              sx={styles.formTextField}
            />
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                value="true"
                id="notify"
                color="primary"
                name="notify"
                checked={formData.notify}
                onChange={(e) => handleInputChange(e, !formData.notify)}
              />
            }
            label="I want to receive updates about current and future events."
          />
          <Button
            type="submit"
            id="updateDetails"
            fullWidth
            variant="contained"
            disabled={isLoading}
            loading={String(isLoading)}
          >
            Update details
          </Button>
        </Box>
      </StyledCard>
    </StyledContainer>
  );
}

export default UserDetailsForm;

const formValidationsUserDetails = [
  {
    validation: (number) => {
      return !number.value;
    },
    errorMessage: "Number is required.",
    field: "number",
    element: () => [document.getElementById("number")],
  },
  {
    validation: (fname) => {
      return !fname.value || fname.value.length < 1;
    },
    errorMessage: "First name is required.",
    field: "fname",
    element: () => [document.getElementById("fname")],
  },
  {
    validation: (lname) => {
      return !lname.value || lname.value.length < 1;
    },
    errorMessage: "Last name is required.",
    field: "lname",
    element: () => [document.getElementById("lname")],
  },
  {
    validation: (iceNumber) => {
      return !iceNumber.value;
    },
    errorMessage: "ICE number is required.",
    field: "iceNumber",
    element: () => [document.getElementById("iceNumber")],
  },
  {
    validation: (iceNumber, number) => {
      return iceNumber.value === number.value;
    },
    errorMessage: "ICE number cannot be your own.",
    field: "iceNumber",
    element: () => [document.getElementById("iceNumber"), document.getElementById("number")],
  },
  {
    validation: (number) => {
      return !phone(number.value, { country: "GB" }).isValid;
    },
    errorMessage: "Number needs to be a valid GB mobile number, landlines not accepted.",
    field: "number",
    element: () => [document.getElementById("number")],
  },
  {
    validation: (iceNumber) => {
      return !phone(iceNumber.value, { country: "GB" }).isValid;
    },
    errorMessage: "ICE number needs to be a valid GB mobile number, landlines not accepted.",
    field: "iceNumber",
    element: () => [document.getElementById("iceNumber")],
  },
];
