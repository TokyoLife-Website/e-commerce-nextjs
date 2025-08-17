"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { RootState, useAppSelector } from "@/redux/store";

export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const user = useAppSelector((state: RootState) => state.user);

    useEffect(() => {
      if (!user.id) {
        return redirect("/");
      }
    }, []);

    if (!user.id) {
      return null;
    }

    return <Component {...props} />;
  };
}
