"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import PaymentFailed from "@/components/checkout/PaymentFailed";

export default function OrderCompletePage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("code");
  return (
    <div className="container mx-auto px-4">
      <PaymentFailed orderCode={orderCode || ""} />
    </div>
  );
}
