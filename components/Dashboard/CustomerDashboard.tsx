import React from "react";
import { User, ShoppingBag, Clock, Star } from "lucide-react";

interface CustomerDashboardProps {
  pin: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ pin }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Customer Dashboard
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <User className="h-6 w-6" />
        </div>
      </div>

      
    </div>
  );
};
