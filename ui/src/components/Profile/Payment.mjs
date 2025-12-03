"use client";

import { TextField, Typography, Button, Box } from "@mui/material";
import { useState } from "react";
import { paymentIntent } from "@/src/lib/backendActions.mjs";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/utils/userContext";

function Payment({ teamId, eventId, cost, paid, isLoading, setIsLoading }) {
  const { user } = useUser();
  const [paymentAmount, setPaymentAmount] = useState("");
  const remainingCost = cost - paid;
  const router = useRouter();

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Event Payment
      </Typography>
      <Typography sx={{ mb: 1 }}>
        Total: £{cost} | Paid: £{paid} |<strong> Remaining:</strong> £{remainingCost}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Amount to pay"
          type="number"
          fullWidth
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
        />
        <Button
          variant="contained"
          disabled={!paymentAmount || Boolean(isLoading)}
          onClick={() => handleSubmitPayment({ router, teamId, eventId, paymentAmount, setIsLoading, userId: user.id })}
        >
          Pay Now
        </Button>
      </Box>
    </>
  );
}

async function handleSubmitPayment({ router, teamId, eventId, paymentAmount, setIsLoading, userId }) {
  try {
    setIsLoading("Creating Payment");
    const response = await paymentIntent({ teamId, eventId, userId, paymentAmount });
    router.push(`/payment?eventId=${eventId}&teamId=${teamId}&clientSecret=${response.clientSecret}`);
  } catch (error) {
    console.error("Failed to initiate payment", { cause: error });
    toast.error("Failed to initiate payment");
  } finally {
    setIsLoading(false);
  }
}

export default Payment;
