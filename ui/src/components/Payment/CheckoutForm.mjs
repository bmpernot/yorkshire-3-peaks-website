"use client";

import ErrorCard from "../common/ErrorCard.mjs";
import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Box } from "@mui/material";
import { styles } from "@/src/styles/payment.mui.styles.mjs";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/result`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={styles.checkoutFormBox}>
      {errorMessage && <ErrorCard error={errorMessage} />}
      <PaymentElement />
      <Button
        variant="contained"
        loading={isProcessing}
        loadingPosition="end"
        id="save-team-changes"
        sx={styles.button}
        type="submit"
      >
        Pay now
      </Button>
    </Box>
  );
}

export default CheckoutForm;
