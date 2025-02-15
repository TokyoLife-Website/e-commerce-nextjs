"use client";
import React from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export const AuthForm = () => {
  return (
    <div className="overflow-y-auto w-[900px] h-[90%] justify-center flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-[60px] pt-[35px] pb-4 bg-white">
      <div className="pr-[30px] w-1/2 border-r border-[#e9e9e9] h-full">
        <LoginForm />
      </div>
      <div className="pl-[30px] w-1/2 h-full ">
        <RegisterForm />
      </div>
    </div>
  );
};
