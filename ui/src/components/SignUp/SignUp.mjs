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
  Stack,
  Card,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LogoTitle } from "../common/CustomIcons.mjs";
import { isEmptyObject } from "../../lib/commonFunctions.mjs";
import { styles } from "../../styles/signUp.mui.styles.mjs";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

function SignUp() {
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    if (!isEmptyObject(errors)) {
      event.preventDefault();
      return;
    }

    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get("name"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
    });
    // setUser({
    //   firstName: "Bruce",
    //   lastName: "Wayne",
    //   email: "bruce.wayne@waynecorp.com",
    //   number: "01234567890",
    //   iceNumber: "01234567891",
    //   role: "admin",
    // });
    // setPageView("account");
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <LogoTitle dataCy="sign-up" />
        <Typography component="h1" variant="h4" sx={styles.title}>
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={styles.formBox}>
          <FormControl>
            <FormLabel htmlFor="fname">First name</FormLabel>
            <TextField
              autoComplete="fname"
              name="fname"
              required
              fullWidth
              id="fname"
              placeholder="Jon"
              error={errors.firstName}
              helperText={errors.firstName}
              color={errors.firstName ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lname">Last name</FormLabel>
            <TextField
              autoComplete="lname"
              name="lname"
              required
              fullWidth
              id="lname"
              placeholder="Snow"
              error={errors.lastName}
              helperText={errors.lastName}
              color={errors.lastName ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="number">Number</FormLabel>
            <TextField
              autoComplete="number"
              name="number"
              required
              fullWidth
              id="number"
              placeholder="01234 567890"
              error={errors.number}
              helperText={errors.number}
              color={errors.number ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="iceNumber">In Case of Emergency (ICE) Number</FormLabel>
            <TextField
              autoComplete="iceNumber"
              name="iceNumber"
              required
              fullWidth
              id="iceNumber"
              placeholder="01234 567890"
              error={errors.iceNumber}
              helperText={errors.iceNumber}
              color={errors.iceNumber ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              required
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              error={errors.email}
              helperText={errors.email}
              color={errors.email ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="••••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              error={errors.password}
              helperText={errors.password}
              color={errors.password ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <TextField
              required
              fullWidth
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              variant="outlined"
              error={errors.confirmPassword}
              helperText={errors.confirmPassword}
              color={errors.confirmPassword ? "error" : "primary"}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="allowEmails" color="primary" />}
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
              <Link
                onClick={() => /*setPageView("signIn")*/ console.log("qwert")}
                variant="body2"
                sx={styles.existingAccountLink}
              >
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
  const fname = document.getElementById("nfame");
  const lname = document.getElementById("lname");
  const number = document.getElementById("number");
  const iceNumber = document.getElementById("iceNumber");
  const confirmPassword = document.getElementById("confirmPassword");

  let isValid = true;
  // refactor so it is less dry

  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    setErrors((errors) => {
      errors.email = "Please enter a valid email address.";
      return errors;
    });
    isValid = false;
  } else {
    setErrors((errors) => {
      delete errors.email;
      return errors;
    });
  }

  if (!password.value || password.value.length < 8) {
    setErrors((errors) => {
      errors.password = "Password must be at least 8 characters long.";
      return errors;
    });
    isValid = false;
  } else {
    setErrors((errors) => {
      delete errors.password;
      return errors;
    });
  }

  if (!confirmPassword.value || confirmPassword.value !== password.value) {
    setErrors((errors) => {
      errors.confirmPassword = "Passwords do not match.";
      return errors;
    });
    isValid = false;
  } else {
    setErrors((errors) => {
      delete errors.confirmPassword;
      return errors;
    });
  }

  if (!number.value || number.value.length !== 11) {
    setErrors((errors) => {
      errors.number = "Number is required.";
      return errors;
    });
    isValid = false;
  } else {
    setErrors((errors) => {
      delete errors.number;
      return errors;
    });
  }

  if (!fname.value || fname.value.length < 1) {
    setErrors((errors) => {
      errors.fname = "First name is required.";
      return errors;
    });
    isValid = false;
  } else {
    setErrors((errors) => {
      delete errors.fname;
      return errors;
    });
  }

  if (!lname.value || lname.value.length < 1) {
    setErrors((errors) => {
      errors.lname = "Last name is required.";
      return errors;
    });
    isValid = false;
  } else {
    setErrors((errors) => {
      delete errors.lname;
      return errors;
    });
  }

  if (!iceNumber.value || iceNumber.value.length !== 11) {
    setErrors((errors) => {
      errors.iceNumber = "ICE number is required.";
      return errors;
    });
    isValid = false;
  } else {
    setErrors((errors) => {
      delete errors.iceNumber;
      return errors;
    });
  }

  return isValid;
};
