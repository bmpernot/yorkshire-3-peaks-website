"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  FormControlLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  ClickAwayListener,
} from "@mui/material";
import { StyledCard, StyledContainer as SignUpContainer } from "../common/CustomComponents.mjs";
import { Info as InfoIcon } from "@mui/icons-material";
import { LogoTitle } from "../common/CustomIcons.mjs";
import { validateInputs } from "../../lib/commonFunctionsClient.mjs";
import { getErrorMessage } from "../../lib/commonFunctionsServer.mjs";
import { styles } from "../../styles/signUp.mui.styles.mjs";
import { useRouter } from "next/navigation";
import { handleSignUp } from "../../lib/cognitoActions.mjs";
import ErrorCard from "../common/ErrorCard.mjs";
import { toast } from "react-toastify";
import { phone } from "phone";

function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: [],
    password: [],
    fname: [],
    lname: [],
    number: [],
    iceNumber: [],
    confirmPassword: [],
  });
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);

    if (!validateInputs(setErrors, formValidationSignUp)) {
      return;
    }

    setIsLoading(true);

    const data = new FormData(event.currentTarget);

    try {
      await handleSignUp(
        router,
        data.get("email"),
        data.get("password"),
        data.get("fname"),
        data.get("lname"),
        phone(data.get("number"), { country: "GB" }).phoneNumber,
        phone(data.get("iceNumber"), { country: "GB" }).phoneNumber,
        data.get("notify") === "true" ? "true" : "false",
      );
    } catch (error) {
      console.error(new Error("An error occurred when trying to sign you up", { cause: error }));
      toast.error(`An error occurred when trying to sign you up`);
      setSubmissionError(getErrorMessage(error.cause));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <LogoTitle dataCy="sign-up" />
        <Box sx={styles.titleBox}>
          <Typography component="h1" variant="h4" sx={styles.title}>
            Sign up
          </Typography>
          <ClickAwayListener onClickAway={() => setIsTooltipOpen(false)}>
            <div>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                  modifiers: [
                    {
                      name: "preventOverflow",
                      options: {
                        boundary: "viewport",
                      },
                    },
                    {
                      name: "offset",
                      options: {
                        offset: [35, 0],
                      },
                    },
                  ],
                }}
                onClose={() => setIsTooltipOpen(false)}
                open={isTooltipOpen}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title="We collect this information in the event of an incident we can provide these details to mountain rescue and other emergency services. Please fill them out to the best of your ability. Thank you."
                placement="bottom-end"
              >
                <IconButton onClick={() => setIsTooltipOpen(true)}>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </div>
          </ClickAwayListener>
        </Box>
        {submissionError ? <ErrorCard error={submissionError} /> : null}
        <Box component="form" onSubmit={handleSubmit} sx={styles.formBox} method="POST">
          <FormControl>
            <FormLabel htmlFor="fname">First name</FormLabel>
            <TextField
              autoComplete="fname"
              name="fname"
              fullWidth
              id="fname"
              placeholder="Jon"
              error={errors.fname.length > 0}
              helperText={errors.fname
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.fname.length > 0 ? "error" : "primary"}
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
              placeholder="Snow"
              error={errors.lname.length > 0}
              helperText={errors.lname
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.lname.length > 0 ? "error" : "primary"}
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
              placeholder="01234 567890"
              error={errors.number.length > 0}
              helperText={errors.number
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.number.length > 0 ? "error" : "primary"}
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
              placeholder="01234 567890"
              error={errors.iceNumber.length > 0}
              helperText={errors.iceNumber
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.iceNumber.length > 0 ? "error" : "primary"}
              sx={styles.formTextField}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              error={errors.email.length > 0}
              helperText={errors.email
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.email.length > 0 ? "error" : "primary"}
              sx={styles.formTextField}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              fullWidth
              name="password"
              placeholder="••••••••"
              type="password"
              id="password"
              autoComplete="new-password"
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
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <TextField
              fullWidth
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              variant="outlined"
              error={errors.confirmPassword.length > 0}
              helperText={errors.confirmPassword
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.confirmPassword.length > 0 ? "error" : "primary"}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value={true} id="notify" color="primary" name="notify" />}
            label="I want to receive updates about current and future events."
          />
          <Button type="submit" fullWidth variant="contained" loading={isLoading} loadingPosition="end">
            Sign up
          </Button>
          <Typography sx={styles.existingAccountTitle}>
            Already have an account?{" "}
            <span>
              <Link onClick={() => router.push("/auth/sign-in")} variant="body2" sx={styles.existingAccountLink}>
                Sign in
              </Link>
            </span>
          </Typography>
        </Box>
      </StyledCard>
    </SignUpContainer>
  );
}

export default SignUp;

const formValidationSignUp = [
  {
    validation: (email) => {
      return !email.value || !/\S+@\S+\.\S+/.test(email.value);
    },
    errorMessage: "Please enter a valid email address.",
    field: "email",
    element: () => [document.getElementById("email")],
  },
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
    validation: (confirmPassword, password) => {
      return !confirmPassword.value || confirmPassword.value !== password.value;
    },
    errorMessage: "Passwords do not match.",
    field: "confirmPassword",
    element: () => [document.getElementById("confirmPassword"), document.getElementById("password")],
  },
];
