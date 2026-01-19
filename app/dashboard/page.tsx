import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CustomerDashboard } from "@/components/Dashboard/CustomerDashboard";
import { AdminDashboard } from "@/components/Dashboard/AdminDashboard";
import { LogoutButton } from "@/components/Dashboard/LogoutButton";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("ROLE")?.value;
  const pin = cookieStore.get("PIN")?.value;

  // Simple protection: if no role/pin, redirect back to login
  if (!role || !pin) {
    redirect("/");
  }

  const isCustomer = role.toLowerCase() === "customer";
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
              <p className="text-xs text-zinc-500 font-mono">PIN: {pin}</p>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 shadow-xl min-h-[600px] flex flex-col">
          {isCustomer && <CustomerDashboard pin={pin} />}
          {isAdmin && <AdminDashboard pin={pin} />}
          {!isCustomer && !isAdmin && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center">
                <ShieldCheckIcon className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="text-zinc-500 max-w-sm">
                Your role "{role}" does not have access to any dashboard view. Please contact support.
              </p>
              <a href="/" className="text-primary font-bold hover:underline">Back to Login</a>
            </div>
          )}
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

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
