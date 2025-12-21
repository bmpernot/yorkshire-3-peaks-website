import Payment from "@/src/components/Payment/Payment.mjs";
import { Suspense } from "react";

export default function PaymentPage() {
  return (
    <Suspense>
      <Payment />;
    </Suspense>
  );
}
