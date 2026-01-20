"use client";

import { LogOut } from "lucide-react";
import { useLogoutButton } from "./LogoutButton.controller";
import { LogoutButtonProps } from "./LogoutButton.type";

export function LogoutButton(props: LogoutButtonProps) {
  const { logout } = useLogoutButton();

  return (
    <button
      onClick={logout}
      className="inline-flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}
