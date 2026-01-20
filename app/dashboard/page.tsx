import { AdminDashboard } from "@/components/Dashboard/AdminDashboard/AdminDashboard.view";
import { LogoutButton } from "@/components/Dashboard/LogoutButton/LogoutButton.view";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("ROLE")?.value;
  const pin = cookieStore.get("PIN")?.value;
  const id = cookieStore.get("ID")?.value;
  const email = cookieStore.get("EMAIL")?.value;

  // Simple protection: if no role/pin/id, redirect back to login
  if (!role || !pin || !id) {
    redirect("/logout");
  }

  // const isCustomer = role.toLowerCase() === "customer";
  const isAdmin = role.toLowerCase() === "admin";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">OutMarket</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 capitalize">{role}</p>
              {/* <p className="text-xs text-zinc-500 font-mono">PIN: {pin}</p> */}
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 shadow-xl min-h-[600px] flex flex-col">
          {isAdmin && <AdminDashboard adminId={id} adminEmail={email || ""} />}
        </main>

        <footer className="text-center py-8">
          <p className="text-sm text-zinc-500">
            &copy; 2026 OutMarket. All rights reserved. Secure Session Terminal.
          </p>
        </footer>
      </div>
    </div>
  );
}
