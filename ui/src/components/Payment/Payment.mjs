"use client";

import { Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Loading from "../common/Loading.mjs";
import { styles } from "@/src/styles/payment.mui.styles.mjs";

function Payment() {
  const params = useSearchParams();
  const clientSecret = params.get("clientSecret");
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const loadStripeComponent = useCallback(
    async (clientSecret) => {
      try {
        setIsLoading(true);
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        const checkoutComponent = await stripe.initEmbeddedCheckout({
          clientSecret,
        });

        checkoutComponent.mount("#checkout");
      } catch (error) {
        console.error("Failed to load payment component", { cause: error });
        toast.error("Failed to load payment component");
        setErrors("Failed to load payment component");
      } finally {
        setIsLoading(false);
      }
    },
    [clientSecret],
  );

  useEffect(() => {
    if (!clientSecret) {
      return;
    }

    loadStripeComponent();
  }, [clientSecret]);

  if (isLoading) {
    <Loading message={"Loading payment"} />;
  }

  return (
    <>
      <Typography variant="h2" sx={styles.mainTitle}>
        Payment
      </Typography>
      {errors.length > 0 ? (
        errors.map((error, index) => {
          return <ErrorCard error={error} index={index} />;
        })
      ) : (
        <div id="checkout" />
      )}
    </>
  );
}

export default Payment;
