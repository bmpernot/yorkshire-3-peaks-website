"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, FormControl, FormLabel, TextField, Typography } from "@mui/material";
import { LogoTitle } from "../common/CustomIcons.mjs";
import { StyledCard, StyledContainer as ResetPasswordContainer } from "../common/CustomComponents.mjs";
import { styles } from "../../styles/signIn.mui.styles.mjs";
import { toast } from "react-toastify";
import { handleConfirmResetPassword, handleResetPassword } from "../../lib/cognitoActions.mjs";
import { isErrors, getErrorMessage } from "../../lib/commonFunctionsServer.mjs";
import ErrorCard from "../common/ErrorCard.mjs";
import { useSearchParams } from "next/navigation";

function ResetPassword() {
  const [errors, setErrors] = useState({
    code: [],
    password: [],
    confirmPassword: [],
  });
  const [submissionError, setSubmissionError] = useState(null);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingResendCode, setIsLoadingResendCode] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
      router.replace("/auth/reset-password");
    } else {
      toast.error("Email not found");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError(null);
    if (isErrors(errors)) {
      return;
    }

    setIsLoadingSubmit(true);

    const data = new FormData(event.currentTarget);
    const formData = {
      confirmationCode: data.get("code"),
      newPassword: data.get("password"),
      username: email,
    };

    try {
      await handleConfirmResetPassword(router, formData);
    } catch (error) {
      console.error(new Error(`An Error occurred when trying to reset your password`, { cause: error }));
      toast.error(`An Error occurred when trying to reset your password`);
      setSubmissionError(getErrorMessage(error.cause));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleResendCode = async () => {
    if (email) {
      try {
        setIsLoadingResendCode(true);
        await handleResetPassword(router, email, true);
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
    <ResetPasswordContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <LogoTitle dataCy="sign-in" />
        <Typography component="h1" variant="h4" sx={styles.signIn.title}>
          Reset Password
        </Typography>
        {submissionError ? <ErrorCard error={submissionError} /> : null}
        <Box component="form" onSubmit={handleSubmit} sx={styles.signIn.form} method="POST">
          <FormControl>
            <FormLabel htmlFor="code">Validation Code</FormLabel>
            <TextField
              id="code"
              name="code"
              placeholder="Code"
              autoComplete="code"
              autoFocus
              fullWidth
              variant="outlined"
              error={errors.code.length > 0}
              helperText={errors.code
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.code.length > 0 ? "error" : "primary"}
              sx={styles.formTextField}
            />
          </FormControl>
          <FormControl>
            <Box sx={styles.signIn.passwordBox}>
              <FormLabel htmlFor="password">New Password</FormLabel>
            </Box>
            <TextField
              name="password"
              placeholder="••••••••"
              type="password"
              id="password"
              fullWidth
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
            <Box sx={styles.signIn.passwordBox}>
              <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
            </Box>
            <TextField
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              id="confirmPassword"
              fullWidth
              variant="outlined"
              error={errors.confirmPassword.length > 0}
              helperText={errors.confirmPassword
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue, "\n"), "")
                .slice(0, -1)}
              color={errors.confirmPassword.length > 0 ? "error" : "primary"}
              sx={styles.formTextField}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={() => {
              validateInputs(setErrors);
            }}
            disabled={isLoadingSubmit}
          >
            Reset Password
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
    </ResetPasswordContainer>
  );
}

export default ResetPassword;

const validateInputs = (setErrors) => {
  const code = document.getElementById("code");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  let isValid = true;
  const formValidations = [
    {
      validation: () => {
        return !code.value || code.value.length !== 6;
      },
      errorMessage: "Please enter a valid code.",
      field: "code",
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
