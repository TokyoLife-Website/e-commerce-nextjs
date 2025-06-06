"use client";
import React from "react";
import CheckoutSuccess from "@/components/checkout/CheckoutSuccess";
import { useSearchParams } from "next/navigation";

export default function OrderCompletePage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("code");
  return (
    <div className="container mx-auto px-4">
      <CheckoutSuccess orderCode={orderCode || ""} />;
    </div>
  );
}
