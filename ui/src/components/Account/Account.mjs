"use client";

import { Grid2 } from "@mui/material";
import { StyledCard, StyledContainer } from "../common/CustomComponents.mjs";
import { LogoTitle } from "../common/CustomIcons.mjs";
import { useUser } from "@/src/utils/userContext";
import UserDetailsForm from "./UserDetailsForm.mjs";
import PasswordForm from "./PasswordForm.mjs";
import DeleteAccountForm from "./DeleteAccountForm.mjs";
import Loading from "../common/Loading.mjs";

function Account() {
  const { user, loading, updateUser } = useUser();

  if (loading) {
    return <Loading message={"Loading users information"} />;
  }

  return (
    <Grid2
      container
      sx={{
        display: "flex",
        justifyContent: "center",
        paddingBottom: "32px",
      }}
    >
      <Grid2 size={12}>
        <StyledContainer direction="column">
          <StyledCard variant="outlined" sx={{ maxWidth: "none" }}>
            <LogoTitle />
          </StyledCard>
        </StyledContainer>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <UserDetailsForm user={user} />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <PasswordForm />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <DeleteAccountForm email={user.email} updateUser={updateUser} />
      </Grid2>
    </Grid2>
  );
}

export default Account;
