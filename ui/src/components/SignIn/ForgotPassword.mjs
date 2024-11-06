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
import { toast } from "react-toastify";

function ForgotPassword({ open, setOpen }) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      PaperProps={{
        component: "form",
        onSubmit: async (event) => {
          event.preventDefault();
          if (!open) {
            return;
          }

          const formData = new FormData(event.currentTarget);
          const email = formData.get("email");

          console.log("Email:", email);

          try {
            ///// need to use aws cognito to send a email to the url to reset the password /////
            await new Promise((resolve, reject) => {
              const x = true;

              if (x === true) {
                setTimeout(resolve, 1000);
              } else {
                setTimeout(reject, 1000);
              }
            });
            /////

            toast.success(`We've sent a email to ${email} with your reset password`);
            setOpen(false);
          } catch (error) {
            console.error(
              new Error(`An Error occurred when trying to send your reset password to ${email}`, { cause: error }),
            );
            toast.error(`An Error occurred when trying to send your reset password to ${email}`);
          }
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
