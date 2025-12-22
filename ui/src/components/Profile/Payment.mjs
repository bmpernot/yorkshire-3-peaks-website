"use client";

import { TextField, Typography, Button, Box, Paper, Divider, LinearProgress } from "@mui/material";
import { useState } from "react";
import { paymentIntent } from "@/src/lib/backendActions.mjs";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/utils/userContext";
import { styles } from "@/src/styles/profile.mui.styles.mjs";

function Payment({ teamId, eventId, cost, paid }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const [paymentAmount, setPaymentAmount] = useState("");

  const remainingCost = cost - paid;

  const isInvalidAmount =
    !paymentAmount ||
    Number(paymentAmount) <= 0 ||
    Number(paymentAmount) > 10000 ||
    !Number.isInteger(Number(paymentAmount));

  const progress = (paid / cost) * 100 || 100;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h6" sx={styles.mainTitle}>
        Event Payment
      </Typography>

      <Box sx={styles.marginBottom2}>
        <Typography variant="subtitle2" sx={styles.marginBottom}>
          Payment Progress
        </Typography>

        <LinearProgress variant="determinate" value={progress} sx={styles.lineBar} />

        <Box sx={styles.paidAmount}>
          <Typography variant="body2">
            £{paid}/{cost} paid
          </Typography>
          <Typography variant="body2">{progress.toFixed(2)}%</Typography>
        </Box>
      </Box>

      <Divider sx={styles.divider} />

      <Typography variant="subtitle1" sx={styles.amountToPay}>
        Enter an amount to pay:
      </Typography>

      <Box sx={styles.amountToPayBox}>
        <TextField
          label="Payment Amount (£)"
          type="number"
          fullWidth
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          size="small"
          id="payment-amount"
        />

        <Button
          variant="contained"
          size="medium"
          sx={styles.payButton}
          loading={isLoading}
          loadingPosition="end"
          disabled={isInvalidAmount}
          onClick={() =>
            handleSubmitPayment({
              router,
              teamId,
              eventId,
              paymentAmount,
              setIsLoading,
              userId: user.id,
            })
          }
          id="pay"
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
      </Box>

      {remainingCost <= 0 && (
        <Typography sx={styles.successText}>
          You&apos;ve already paid the full amount! However you are welcome to donate more.
        </Typography>
      )}
    </Paper>
  );
}

async function handleSubmitPayment({ router, teamId, eventId, paymentAmount, setIsLoading, userId }) {
  try {
    setIsLoading("Creating Payment");
    const paymentAmountInPenceToNearestPound = Math.round(paymentAmount) * 100;
    const response = await paymentIntent({ teamId, eventId, userId, amount: paymentAmountInPenceToNearestPound });
    router.push(`/payment?clientSecret=${response.clientSecret}`);
  } catch (error) {
    console.error("Failed to initiate payment", { cause: error });
    toast.error("Failed to initiate payment");
    setIsLoading(false);
  }
}

export default Payment;
