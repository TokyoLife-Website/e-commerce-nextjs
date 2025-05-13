"use client";

import React from "react";
import { usePathname } from "next/navigation";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="bg-[#f5f5f5]">
      {/* Stepper */}
      <CheckoutStepper pathname={pathname} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
