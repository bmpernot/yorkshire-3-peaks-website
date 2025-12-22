"use client";

import { Box, Typography, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { styles } from "@/src/styles/payment.mui.styles.mjs";

function PaymentResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectStatus = searchParams.get("redirect_status");

  return <Box sx={styles.paymentResultsBox}>{renderContent({ router, redirectStatus })}</Box>;
}

export default PaymentResult;

function renderContent({ router, redirectStatus }) {
  switch (redirectStatus) {
    case "succeeded":
      return <SuccessfulResult router={router} />;

    case "failed":
      return <FailedResult router={router} />;

    case "canceled":
      return <CanceledResult router={router} />;

    case "processing":
      return <ProcessingResult router={router} />;

    default:
      return <UnknownResult router={router} />;
  }
}

function SuccessfulResult({ router }) {
  return (
    <>
      <Typography variant="h2" sx={styles.mainTitle}>
        Payment Successful
      </Typography>

      <Typography variant="h5" sx={styles.marginYAxis4}>
        Thank you for your contribution. Your payment has been processed successfully.
      </Typography>

      <Box sx={styles.marginBottom4}>
        <Typography variant="body1">
          You can view your registration details and manage your team from your profile page.
        </Typography>
        <Typography variant="body1">
          Please be patient while the payment system updates our records of your contribution.
        </Typography>
      </Box>

      <Button variant="contained" onClick={() => router.push("/user/profile")} sx={styles.profileButton}>
        Go to My Profile
      </Button>
    </>
  );
}

function FailedResult({ router }) {
  return (
    <>
      <Typography variant="h2" sx={styles.mainTitle}>
        Payment Failed
      </Typography>

      <Typography variant="h5" sx={styles.marginYAxis4}>
        Unfortunately, your payment could not be completed.
      </Typography>

      <Typography variant="body1" sx={styles.marginBottom4}>
        No funds have been taken. Please try again or use a different payment method.
      </Typography>

      <Button variant="contained" onClick={() => router.push("/user/profile")} sx={styles.profileButton}>
        Go to My Profile
      </Button>
    </>
  );
}

function CanceledResult({ router }) {
  return (
    <>
      <Typography variant="h2" sx={styles.mainTitle}>
        Payment Canceled
      </Typography>

      <Typography variant="h5" sx={styles.marginYAxis4}>
        You canceled the payment before it was completed.
      </Typography>

      <Typography variant="body1" sx={styles.marginBottom4}>
        You can safely return and try again whenever you are ready.
      </Typography>

      <Button variant="contained" onClick={() => router.push("/user/profile")} sx={styles.profileButton}>
        Go to My Profile
      </Button>
    </>
  );
}

function ProcessingResult({ router }) {
  return (
    <>
      <Typography variant="h2" sx={styles.mainTitle}>
        Payment Processing
      </Typography>

      <Typography variant="h5" sx={styles.marginYAxis4}>
        Your payment is currently being processed.
      </Typography>

      <Typography variant="body1" sx={styles.marginBottom4}>
        This may take a short while. You will see the update reflected in your profile once confirmed.
      </Typography>

      <Button variant="contained" onClick={() => router.push("/user/profile")} sx={styles.profileButton}>
        Go to My Profile
      </Button>
    </>
  );
}

function UnknownResult({ router }) {
  return (
    <>
      <Typography variant="h2" sx={styles.mainTitle}>
        Payment Status Unknown
      </Typography>

      <Typography variant="h5" sx={styles.marginYAxis4}>
        We could not determine the outcome of your payment.
      </Typography>

      <Typography variant="body1" sx={styles.marginBottom4}>
        Please check your profile later or contact support if the issue persists.
      </Typography>

      <Button variant="contained" onClick={() => router.push("/user/profile")} sx={styles.profileButton}>
        Go to My Profile
      </Button>
    </>
  );
}
