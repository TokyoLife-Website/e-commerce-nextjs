"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { RootState, useAppSelector } from "@/redux/store";

export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const { isAuthenticated } = useAppSelector(
      (state: RootState) => state.auth
    );

    useEffect(() => {
      if (!isAuthenticated) {
        return redirect("/");
      }
    }, []);

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
