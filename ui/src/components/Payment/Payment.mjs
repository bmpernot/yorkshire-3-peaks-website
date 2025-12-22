"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";
import { Typography, Box } from "@mui/material";
import Loading from "../common/Loading.mjs";
import { styles } from "@/src/styles/payment.mui.styles.mjs";
import CheckoutForm from "./CheckoutForm.mjs";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function Payment() {
  const params = useSearchParams();
  const clientSecret = params.get("clientSecret");

  if (!clientSecret) {
    return <Loading message="Initializing payment..." />;
  }

  return (
    <Box sx={styles.paymentBox}>
      <Typography variant="h2" sx={styles.mainTitle}>
        Payment
      </Typography>

      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    </Box>
  );
}

export default Payment;
