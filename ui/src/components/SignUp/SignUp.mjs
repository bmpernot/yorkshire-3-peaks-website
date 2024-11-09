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
import { isErrors } from "../../lib/commonFunctionsServer.mjs";
import { styles } from "../../styles/signUp.mui.styles.mjs";
import { useRouter } from "next/navigation";

function SignUp() {
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
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isErrors(errors)) {
      return;
    }

    const data = new FormData(event.currentTarget);
    console.log({
      firstName: data.get("fname"),
      lastName: data.get("lname"),
      email: data.get("email"),
      password: data.get("password"),
      number: data.get("number"),
      iceNumber: data.get("iceNumber"),
      notify: data.get("notify") === "true" ? true : false,
    });

    //// TODO - need to call the aws cognito helper function ot sign up the user with this data /////
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={() => {
              validateInputs(setErrors);
            }}
          >
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

const validateInputs = (setErrors) => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const fname = document.getElementById("fname");
  const lname = document.getElementById("lname");
  const number = document.getElementById("number");
  const iceNumber = document.getElementById("iceNumber");
  const confirmPassword = document.getElementById("confirmPassword");

  let isValid = true;
  const formValidations = [
    {
      validation: () => {
        return !email.value || !/\S+@\S+\.\S+/.test(email.value);
      },
      errorMessage: "Please enter a valid email address.",
      field: "email",
    },
    {
      validation: () => {
        return !password.value || password.value.length < 8;
      },
      errorMessage: "Password must be at least 8 characters long.",
      field: "password",
    },
    {
      validation: () => {
        return !/[A-Z]/.test(password.value);
      },
      errorMessage: "Password must have a upper case letter.",
      field: "password",
    },
    {
      validation: () => {
        return !/[a-z]/.test(password.value);
      },
      errorMessage: "Password must have a lower case letter.",
      field: "password",
    },
    {
      validation: () => {
        return !/\d/.test(password.value);
      },
      errorMessage: "Password must have a number.",
      field: "password",
    },
    {
      validation: () => {
        return !/[^$*.[\]{}()?\\!"@#%&/\\,><':;|_~`+=-]/.test(password.value);
      },
      errorMessage: "Password must have special characters.",
      field: "password",
    },
    {
      validation: () => {
        return !confirmPassword.value || confirmPassword.value !== password.value;
      },
      errorMessage: "Passwords do not match.",
      field: "confirmPassword",
    },
    {
      validation: () => {
        return !number.value || number.value.length !== 11;
      },
      errorMessage: "Number is required.",
      field: "number",
    },
    {
      validation: () => {
        return !fname.value || fname.value.length < 1;
      },
      errorMessage: "First name is required.",
      field: "fname",
    },
    {
      validation: () => {
        return !lname.value || lname.value.length < 1;
      },
      errorMessage: "Last name is required.",
      field: "lname",
    },
    {
      validation: () => {
        return !iceNumber.value || iceNumber.value.length !== 11;
      },
      errorMessage: "ICE number is required.",
      field: "iceNumber",
    },
  ];

  formValidations.forEach((formValidation) => {
    if (formValidation.validation()) {
      setErrors((errors) => {
        let newErrors = { ...errors };
        if (!errors[formValidation.field].includes(formValidation.errorMessage)) {
          newErrors = {
            ...errors,
            [formValidation.field]: [...errors[formValidation.field], formValidation.errorMessage],
          };
        }
        isValid = errors[formValidation.field].length > 0 ? false : true;
        return newErrors;
      });
    } else {
      setErrors((errors) => {
        let newErrors = { ...errors };
        if (errors[formValidation.field].includes(formValidation.errorMessage)) {
          const updatedFieldErrors = errors[formValidation.field].filter(
            (element) => element !== formValidation.errorMessage,
          );
          newErrors = {
            ...errors,
            [formValidation.field]: updatedFieldErrors,
          };
        }
        return newErrors;
      });
    }
  });

  return isValid;
};
