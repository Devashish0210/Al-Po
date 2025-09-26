"use client";

import { usePathname } from "next/navigation";
import PageAuthenticatorBGV from "./page-authentication-bgv";
import PageAuthenticatorMain from "./page-authenticator-main";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import checkServerStatus from "../_api-helpers/check-server";

export default function PageContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  const path = usePathname();
  const router = useRouter();

  // Define public routes that don't need authentication or redirection
  const publicRoutes = [
    "/service-down",
    "/adminui/login",
    "/adminui/main",
    "/adminui/relieving-letter",
    "/adminui/remove-ndc",
  ];
  const isPublicRoute = publicRoutes.includes(path);

  useEffect(() => {
    const wait = async () => {
      const res = await checkServerStatus();
      if (res) {
        setLoading(false);
      } else {
        router.push("/service-down");
      }
    };

    if (isPublicRoute) {
      // Don't check server for public routes and don't redirect
      setLoading(false);
    } else {
      wait();
    }
  }, [path, router, isPublicRoute]);

  const [loading, setLoading] = useState(true);

  // Return appropriate layout based on path
  if (loading) {
    return <Loading />;
  }

  // For public routes that aren't service-down or BGV verification, render children directly
  if (isPublicRoute && path !== "/service-down") {
    return <>{children}</>;
  }

  // For special routes, use their specific authenticators
  if (path === "/employee-verification") {
    return <PageAuthenticatorBGV>{children}</PageAuthenticatorBGV>;
  }

  // Default case - use the main authenticator
  return <PageAuthenticatorMain path={path}>{children}</PageAuthenticatorMain>;
}
