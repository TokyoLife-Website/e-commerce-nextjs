import { Modal } from "@/components/layouts/modals/Modal";
import { Footer } from "@/components/layouts/Footer";
import { Header } from "@/components/header/Header";
import React from "react";
import { ChatWidget } from "@/components/chat";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Modal />
      <Header />
      <ChatWidget
        zaloUrl="https://zalo.me/0373635003"
        messengerUrl="https://m.me/100029235277183"
        adminChatUrl="/admin-chat"
      />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
