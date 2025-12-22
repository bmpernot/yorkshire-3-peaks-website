import PaymentResult from "@/src/components/Payment/PaymentResult.mjs";
import { Suspense } from "react";

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentResult />;
    </Suspense>
  );
}
