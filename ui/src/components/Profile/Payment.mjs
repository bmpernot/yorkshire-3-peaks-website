"use client";

import { TextField, Typography, Button, Box, Paper, Divider, LinearProgress } from "@mui/material";
import { useState } from "react";
import { paymentIntent } from "@/src/lib/backendActions.mjs";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/utils/userContext";

function Payment({ teamId, eventId, cost, paid }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const [paymentAmount, setPaymentAmount] = useState("");

  const remainingCost = cost - paid;

  const isInvalidAmount =
    !paymentAmount ||
    Number(paymentAmount) <= 0 ||
    Number(paymentAmount) > 1000 ||
    !Number.isInteger(Number(paymentAmount));

  const progress = (paid / cost) * 100;

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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Event Payment
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Payment Progress
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="body2">
            £{paid}/{cost} paid
          </Typography>
          <Typography variant="body2">{progress.toFixed(2)}%</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
        Enter an amount to pay:
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
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
          sx={{ whiteSpace: "nowrap", px: 3 }}
          disabled={isInvalidAmount || isLoading}
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
        <Typography sx={{ mt: 2, color: "success.main" }}>
          You've already paid the full amount! However you are welcome to donate more.
        </Typography>
      )}
    </Paper>
  );
}

async function handleSubmitPayment({ router, teamId, eventId, paymentAmount, setIsLoading, userId }) {
  try {
    setIsLoading("Creating Payment");
    const paymentAmountInPenceToNearestPound = Math.round(paymentAmount) * 100;
    const response = await paymentIntent({ teamId, eventId, userId, paymentAmountInPenceToNearestPound });
    router.push(`/payment?eventId=${eventId}&teamId=${teamId}&clientSecret=${response.clientSecret}`);
  } catch (error) {
    console.error("Failed to initiate payment", { cause: error });
    toast.error("Failed to initiate payment");
  } finally {
    setIsLoading(false);
  }
}

export default Payment;
