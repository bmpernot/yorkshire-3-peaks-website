"use client";

import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
} from "@mui/material";
import { styles } from "../../styles/signIn.mui.styles.mjs";

function ForgotPassword({ open, setOpen }) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);
          const email = formData.get("email");

          console.log("Email:", email);

          setOpen(false);
        },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent sx={styles.forgotPassword.dialogContent}>
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a link to reset your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus={true}
          required={true}
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth={true}
        />
      </DialogContent>
      <DialogActions sx={styles.forgotPassword.dialogActions}>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ForgotPassword;
