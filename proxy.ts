import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if we are on the home page (login page)
  if (pathname === "/") {
    const role = request.cookies.get("ROLE")?.value;
    const pin = request.cookies.get("PIN")?.value;

    // If both ROLE and PIN exist, redirect to /dashboard
    if (role && pin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
