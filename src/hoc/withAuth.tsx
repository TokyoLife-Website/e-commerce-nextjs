"use client";
import Loading from "@/components/common/Loading";
import { useAppSelector } from "@/redux/store";
import { Role } from "@/types/role";
import { useRouter, usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

interface Options {
  role: Role;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Options
) {
  const ProtectedPage: React.FC<P> = (props) => {
    const { role, firstName } = useAppSelector((state) => state.user);
    const router = useRouter();
    const pathname = usePathname();

    useLayoutEffect(() => {
      if (!firstName) {
        if (options.role === Role.ADMIN && pathname !== "/admin/login") {
          router.replace("/admin/login");
        } else if (options.role !== Role.ADMIN && pathname !== "/") {
          router.replace("/");
        }
      } else if (role !== options.role) {
        if (role === Role.ADMIN) {
          router.replace("/admin");
        } else {
          router.replace("/");
        }
      }
    }, [firstName, role, router]);

    if (!firstName || role !== options.role) {
      return (
        <div suppressHydrationWarning>
          <Loading fullScreen size="large" />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
  return ProtectedPage;
}
