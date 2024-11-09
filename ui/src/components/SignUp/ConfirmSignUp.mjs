"use client";

import { useState } from "react";
import { Box, Button, FormControl, FormLabel, TextField, Typography, Card } from "@mui/material";
import { LogoTitle } from "../common/CustomIcons.mjs";
import { StyledCard, StyledContainer as ConfirmSignUpContainer } from "../common/CustomComponents.mjs";
import { styles } from "../../styles/signIn.mui.styles.mjs";
import { toast } from "react-toastify";

function ConfirmSignUp() {
  const [codeErrorMessage, setCodeErrorMessage] = useState(null);
  const [invalidCode, setInvalidCode] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setInvalidCode(false);
    if (codeErrorMessage) {
      event.preventDefault();
      return;
    }

    const data = new FormData(event.currentTarget);
    console.log({
      code: data.get("code"),
    });

    try {
      ///// need to call aws cognito actions to sign the user in with the code and password from the form /////

      const response = await new Promise((resolve, reject) => {
        const x = true;

        if (x === true) {
          // setTimeout(resolve("Invalid Code"), 1000);
          setTimeout(resolve(), 1000);
        } else {
          setTimeout(reject, 1000);
        }
      });
      /////

      if (response === "Invalid Code") {
        setInvalidCode(true);
      }
    } catch (error) {
      console.error(new Error(`An Error occurred when trying to confirm your account`, { cause: error }));
      toast.error(`An Error occurred when trying to confirm your account.`);
    }
  };

  return (
    <ConfirmSignUpContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <LogoTitle dataCy="sign-in" />
        <Typography component="h1" variant="h4" sx={styles.signIn.title}>
          Confirm Account
        </Typography>
        {invalidCode ? <InvalidCode /> : null}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={styles.signIn.form}>
          <FormControl>
            <FormLabel htmlFor="code">Confirmation code</FormLabel>
            <TextField
              error={codeErrorMessage || invalidCode ? true : false}
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
          >
            Submit
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              console.log("resend confirmation code");
              // TODO - need to resend confirmation code using aws cognito helper functions //
            }}
          >
            Resend code
          </Button>
        </Box>
      </StyledCard>
    </ConfirmSignUpContainer>
  );
}

export default ConfirmSignUp;

function InvalidCode() {
  return (
    <Card variant="outlined" sx={styles.invalidLogin}>
      <Typography sx={{ justifyContent: "center", alignItems: "center" }}>Code invalid</Typography>
    </Card>
  );
}

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
