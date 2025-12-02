"use client";

import { TextField, Typography, Button, Box } from "@mui/material";
import { useState } from "react";
import { paymentIntent } from "@/src/lib/backendActions.mjs";
import { toast } from "react-toastify";

function Payment({ teamId, eventId, cost, paid, isLoading, setIsLoading }) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const remainingCost = cost - paid;

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
          onClick={() => handleSubmitPayment({ teamId, eventId, paymentAmount, setIsLoading })}
        >
          Pay Now
        </Button>
      </Box>
    </>
  );
}

async function handleSubmitPayment({ teamId, eventId, paymentAmount, setIsLoading }) {
  try {
    setIsLoading("Creating Payment");
    const response = await paymentIntent({ teamId, eventId, paymentAmount });
    console.log(response);
    // TODO - using the response with the client and secret pass it into the next page
    // TODO - create the page with the embedded stripe component to allow them to pay
  } catch (error) {
    console.error("Failed to initiate payment", { cause: error });
    toast.error("Failed to initiate payment");
  } finally {
    setIsLoading(false);
  }
}

export default Payment;
