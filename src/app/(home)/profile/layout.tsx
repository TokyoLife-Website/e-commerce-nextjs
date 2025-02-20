import SideBar from "@/components/layouts/SideBar";
import { Avatar } from "@mui/material";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#faf9f8] pt-10">
      <div className="mx-40 px-6">
        <div className="flex gap-4 items-center pt-8">
          <Avatar
            sizes="small"
            alt={"tien"}
            src="/static/images/avatar/1.jpg"
            sx={{ position: "unset", width: 52, height: 52 }}
          />
          <div className="flex flex-col gap-1 leading-[18px] text-sm font-normal">
            <div>Xin chào,</div>
            <div className="font-bold">Tiến Lê</div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5 pb-9 mt-7">
          <SideBar />
          <main className="col-span-3">
            <div className="bg-white p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
