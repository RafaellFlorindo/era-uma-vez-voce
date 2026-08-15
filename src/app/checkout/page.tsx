import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutContent } from "./CheckoutContent";

export const metadata: Metadata = {
  title: "Finalizar | Era Uma Vez Você",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
