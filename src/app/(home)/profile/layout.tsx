"use client";
import isAuth from "@/components/layouts/isAuth";
import SideBar from "@/components/layouts/SideBar";
import { RootState, useAppSelector } from "@/redux/store";
import { Avatar } from "@mui/material";
import React from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const { firstName, lastName, avatar } = useAppSelector(
    (state: RootState) => state.user
  );
  return (
    <div className="bg-[#faf9f8] pt-10">
      <div className="mx-40 px-6">
        <div className="flex gap-4 items-center pt-8">
          <Avatar
            src={avatar?.url}
            sizes="small"
            alt={"avatar"}
            sx={{
              position: "unset",
              width: 52,
              height: 52,
            }}
          />
          <div className="flex flex-col gap-1 leading-[18px] text-sm font-normal">
            <div>Xin chào,</div>
            <div className="font-bold">{`${firstName} ${lastName}`}</div>
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
};

export default isAuth(ProfileLayout);
