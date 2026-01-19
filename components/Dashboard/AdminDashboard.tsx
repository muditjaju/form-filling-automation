import React from "react";
import { Settings, Users, BarChart3, ShieldCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AdminDashboardProps {
  pin: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ pin }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Admin Console
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            System overview and administrative controls.
          </p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
          <ShieldCheck className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
