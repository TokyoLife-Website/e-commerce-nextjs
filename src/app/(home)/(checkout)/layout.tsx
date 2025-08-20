"use client";

import React from "react";
import { usePathname } from "next/navigation";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import { withAuth } from "@/hoc/withAuth";
import { Role } from "@/types/role";

function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOrderCompletePage = pathname === "/order-complete";
  return (
    <div className={isOrderCompletePage ? "bg-white" : "bg-[#f5f5f5]"}>
      {/* Stepper */}
      <CheckoutStepper pathname={pathname} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  );
}

export default withAuth(CheckoutLayout, { role: Role.USER });
