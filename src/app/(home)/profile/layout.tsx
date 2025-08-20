"use client";
import SideBar from "@/components/layouts/SideBar";
import { withAuth } from "@/hoc/withAuth";
import { RootState, useAppSelector } from "@/redux/store";
import { Role } from "@/types/role";
import { Avatar } from "@mui/material";
import React from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const { firstName, lastName, avatar } = useAppSelector(
    (state: RootState) => state.user
  );
  return (
    <div className="bg-[#faf9f8] pt-4 md:pt-10">
      <div className="mx-2 sm:mx-6 md:mx-16 lg:mx-32 xl:mx-40 px-2 sm:px-4 md:px-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center pt-4 md:pt-8">
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
          <div className="flex flex-col gap-1 leading-[18px] text-sm md:text-base font-normal">
            <div>Xin chào,</div>
            <div className="font-bold">{`${firstName} ${lastName}`}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pb-9 mt-7">
          <SideBar />
          <main className="col-span-1 md:col-span-3">
            <div className="bg-white p-4 md:p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ProfileLayout, { role: Role.USER });
