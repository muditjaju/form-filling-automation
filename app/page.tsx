

import { LoginComponent } from "@/components/LoginComponent/LoginComponent.view";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-zinc-50 to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-4">
      <LoginComponent />
    </main>
  );
}
