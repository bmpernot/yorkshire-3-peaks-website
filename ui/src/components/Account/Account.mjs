"use client";

import { useState } from "react";
import { Grid2 } from "@mui/material";
import { StyledCard, StyledContainer } from "../common/CustomComponents.mjs";
import { LogoTitle } from "../common/CustomIcons.mjs";
import useAuthUser from "@/src/app/hooks/use-auth-user";
import UserDetailsForm from "./UserDetailsForm.mjs";
import PasswordForm from "./PasswordForm.mjs";
import DeleteAccountForm from "./DeleteAccountForm.mjs";
import { getErrorMessage } from "@/src/lib/commonFunctionsServer.mjs";
import ErrorCard from "../common/ErrorCard.mjs";

function Account() {
  const [error, setError] = useState();
  let id, email, firstName, lastName, number, iceNumber, notify;

  try {
    const user = useAuthUser();
    id = user.id;
    email = user.email;
    firstName = user.firstName;
    lastName = user.lastName;
    number = user.number;
    iceNumber = user.iceNumber;
    notify = user.notify;
  } catch (error) {
    setError(getErrorMessage(error));
  }

  return error ? (
    <ErrorCard error={error} />
  ) : (
    <Grid2
      container
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Grid2 size={12}>
        <StyledContainer direction="column">
          <StyledCard variant="outlined" sx={{ maxWidth: "none" }}>
            <LogoTitle />
          </StyledCard>
        </StyledContainer>
      </Grid2>
      <Grid2 xs={12} md={4}>
        <UserDetailsForm
          email={email}
          firstName={firstName}
          lastName={lastName}
          number={number}
          iceNumber={iceNumber}
          notify={notify}
        />
      </Grid2>
      <Grid2 xs={12} md={4}>
        <PasswordForm />
      </Grid2>
      <Grid2 xs={12} md={4}>
        <DeleteAccountForm id={id} email={email} />
      </Grid2>
    </Grid2>
  );
}

export default Account;
