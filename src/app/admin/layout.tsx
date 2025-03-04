import { Modal } from "@/components/modals/Modal";
import { Footer } from "@/components/layouts/Footer";
import { Header } from "@/components/layouts/header/Header";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Modal />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
