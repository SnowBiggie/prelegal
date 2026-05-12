"use client";

import { useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";

export default function Home() {
  useEffect(() => {
    window.location.replace(isAuthenticated() ? "/dashboard/" : "/login/");
  }, []);
  return null;
}
