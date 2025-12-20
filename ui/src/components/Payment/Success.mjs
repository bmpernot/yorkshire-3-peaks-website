"use client";

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { styles } from "@/src/styles/payment.mui.styles.mjs";

function Success() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h2" sx={styles.mainTitle}>
        Payment Successful!
      </Typography>

      <Typography variant="h5" sx={{ my: 4 }}>
        Thank you for your contribution. Your payment has been processed successfully.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1">
          You can view your registration details and manage your team from your profile page.
        </Typography>
        <Typography variant="body1">
          Please be patient while the payment system updates our system of your contribution.
        </Typography>
      </Box>

      <Button variant="contained" color="primary" onClick={() => router.push("/user/profile")} sx={{ px: 4, py: 1.5 }}>
        Go to My Profile
      </Button>
    </Box>
  );
}

export default Success;
