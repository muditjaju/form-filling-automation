"use client";

import { useEffect } from "react";
import { useLoginController } from "@/components/LoginComponent/LoginComponent.controller";

export default function LogoutPage() {
  const { logout } = useLoginController();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <h1 className="text-2xl font-semibold text-foreground">Logging out...</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          Please wait while we securely sign you out of your account.
        </p>
      </div>
    </div>
  );
}
