"use client";

import { Grid2 } from "@mui/material";
import { StyledCard, StyledContainer } from "../common/CustomComponents.mjs";
import { LogoTitle } from "../common/CustomIcons.mjs";
import useAuthUser from "@/src/app/hooks/use-auth-user";
import UserDetailsForm from "./UserDetailsForm.mjs";
import PasswordForm from "./PasswordForm.mjs";
import DeleteAccountForm from "./DeleteAccountForm.mjs";

function Account() {
  // TODO - make sure data is right
  const { id, email, firstName, lastName, number, iceNumber, notify } = useAuthUser();

  return (
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
